import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiArrowRight, FiClock, FiPackage, FiSearch } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const loadRazorpay = () =>
    new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// New component for updating map view
const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

// Component for handling map clicks
const LocationMarker = ({ position, setPosition, setAddress }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            reverseGeocode(lat, lng, setAddress);
        },
    });

    return position ? <Marker position={position} /> : null;
};

// Reverse geocoding function
const reverseGeocode = async (lat, lng, setAddress) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.display_name) {
            setAddress(data.display_name);
        }
    } catch (error) {
        console.error('Reverse geocoding error:', error);
    }
};

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState([28.6139, 77.2090]); // Default: Delhi
    const [searching, setSearching] = useState(false);
    const searchTimeout = useRef(null);

    // Initial user location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const newPos = [pos.coords.latitude, pos.coords.longitude];
                setPosition(newPos);
                reverseGeocode(newPos[0], newPos[1], setAddress);
            });
        }
    }, []);

    // Handle address change to update map (geocoding)
    const handleAddressChange = (newAddress) => {
        setAddress(newAddress);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            if (!newAddress || newAddress.length < 3) return;
            setSearching(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newAddress)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            } finally {
                setSearching(false);
            }
        }, 1500); // Debounce search
    };

    const handleCOD = async () => {
        await api.post('/orders', {
            items: cart.items.map(i => ({ foodId: i.foodId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
            totalAmount: cartTotal, deliveryAddress: address, paymentMethod: 'COD',
        });
        await clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate('/orders');
    };

    const handleOnlinePayment = async () => {
        const loaded = await loadRazorpay();
        if (!loaded) { toast.error('Razorpay failed to load'); return; }
        const { data: rzpData } = await api.post('/payment/create-order', { amount: cartTotal });
        const { data: order } = await api.post('/orders', {
            items: cart.items.map(i => ({ foodId: i.foodId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
            totalAmount: cartTotal, deliveryAddress: address, paymentMethod: 'Online', razorpayOrderId: rzpData.orderId,
        });
        const options = {
            key: rzpData.keyId, amount: rzpData.amount, currency: rzpData.currency,
            name: 'ChatoriApp', description: 'Food Order', order_id: rzpData.orderId,
            handler: async (response) => {
                try {
                    await api.post('/payment/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: order._id,
                    });
                    await clearCart(); navigate('/payment-success');
                } catch { navigate('/payment-failed'); }
            },
            prefill: { name: user.name, email: user.email },
            theme: { color: '#f97316' },
            modal: { ondismiss: () => toast('Payment cancelled') },
        };
        new window.Razorpay(options).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!address.trim()) { toast.error('Please enter delivery address'); return; }
        if (cart.items.length === 0) { toast.error('Cart is empty'); return; }
        setLoading(true);
        try {
            if (paymentMethod === 'COD') await handleCOD();
            else await handleOnlinePayment();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-950 px-4 pb-20 relative overflow-hidden">
            {/* Decorative background orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -ml-48 -mb-48"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12 text-center pt-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4"
                    >
                        Review & <span className="text-orange-500 underline decoration-orange-200 dark:decoration-orange-900/50 decoration-8 underline-offset-8">Checkout</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 dark:text-gray-400 font-bold tracking-wide mt-5 uppercase text-xs"
                    >
                        Finalize your royal feast details
                    </motion.p>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left - Details Form */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Address & Map */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500">
                                        <FiMapPin size={20} />
                                    </div>
                                    <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">Delivery Address</h3>
                                </div>
                                {searching && <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse">Syncing Map...</div>}
                            </div>

                            {/* Map Container */}
                            <div className="w-full h-[200px] sm:h-[300px] rounded-2xl overflow-hidden mb-6 border border-gray-100 dark:border-gray-800 shadow-inner relative group">
                                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <ChangeView center={position} />
                                    <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
                                </MapContainer>
                                <div className="absolute bottom-4 left-4 z-[10] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest pointer-events-none transform transition-transform group-hover:scale-95 shadow-sm">
                                    Click map to pick location
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    rows={3}
                                    placeholder="Enter your full street address, apartment, and landmark..."
                                    value={address}
                                    onChange={e => handleAddressChange(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none placeholder-gray-400"
                                />
                                <div className="absolute right-4 bottom-4 text-orange-500 opacity-50">
                                    <FiSearch size={18} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment method */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500">
                                    <FiCreditCard size={20} />
                                </div>
                                <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">Payment Method</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {[{ val: 'COD', label: 'Cash on Delivery', sub: 'Pay when your food arrives', icon: '🛵' },
                                { val: 'Online', label: 'Online Payment', sub: 'Credit/Debit, UPI or Wallets', icon: '💳' }].map(m => (
                                    <label key={m.val}
                                        className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300
                                          ${paymentMethod === m.val
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/5 shadow-lg shadow-orange-500/10'
                                                : 'border-gray-100 dark:border-gray-800 hover:border-orange-500/30 bg-gray-50/50 dark:bg-transparent'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl">{m.icon}</div>
                                            <div>
                                                <p className="font-black text-gray-900 dark:text-white text-sm">{m.label}</p>
                                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">{m.sub}</p>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={m.val}
                                            checked={paymentMethod === m.val}
                                            onChange={() => setPaymentMethod(m.val)}
                                            className="w-5 h-5 accent-orange-500"
                                        />
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 h-fit sticky top-24"
                        >
                            <h3 className="font-black text-gray-900 dark:text-white text-xl mb-6 tracking-tight">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                {cart.items.map(item => (
                                    <div key={item._id} className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-500 truncate max-w-[150px]">{item.name} <span className="text-orange-500 ml-1">×{item.quantity}</span></span>
                                        <span className="text-gray-900 dark:text-white tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 dark:text-white text-sm tracking-tighter">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                    <span>Delivery</span>
                                    <span className="text-green-500 tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-1">Payable Amount</span>
                                    <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-10 flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        {paymentMethod === 'COD' ? 'Confirm Order' : 'Pay Now'} <FiArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <p className="mt-6 text-[9px] text-gray-400 font-bold text-center uppercase tracking-[0.2em] leading-relaxed">
                                Secure Payment & Fast Delivery Guaranteed
                            </p>
                        </motion.div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
