import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import api from '../../api/axios';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
    Pending: { icon: <FiClock />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    Preparing: { icon: <FiPackage />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    'Out for Delivery': { icon: <FiTruck />, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    Delivered: { icon: <FiCheckCircle />, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    Cancelled: { icon: <FiXCircle />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const payStyle = {
    COD: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    Paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    Failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { reorder } = useCart();
    const navigate = useNavigate();
    const [reorderingId, setReorderingId] = useState(null);

    useEffect(() => {
        const fetchOrders = () => {
            api.get('/orders/user')
                .then(({ data }) => setOrders(data))
                .catch(err => console.error("Polling error:", err))
                .finally(() => setLoading(false));
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleOrderAgain = async (order) => {
        setReorderingId(order._id);
        try {
            await reorder(order.items);
            toast.success('Items added to cart! Redirecting to checkout...');
            navigate('/checkout');
        } catch (err) {
            toast.error('Failed to reorder items');
        } finally {
            setReorderingId(null);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-950 px-4 pb-20 relative overflow-hidden">
            {/* Decorative background orb */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -ml-48 -mb-48"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12 text-center pt-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4"
                    >
                        Your <span className="text-orange-500 underline decoration-orange-200 dark:decoration-orange-900/50 decoration-8 underline-offset-8">Orders</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 dark:text-gray-400 font-bold tracking-wide mt-5 uppercase text-xs"
                    >
                        Total {orders.length} Orders Found
                    </motion.p>
                </header>

                <AnimatePresence mode="popLayout">
                    {orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl"
                        >
                            <div className="text-9xl mb-6 grayscale opacity-20">📦</div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No orders yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">Your throne is waiting for a feast!</p>
                            <button className="px-8 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">
                                Start Ordering
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-5 sm:p-7 hover:border-orange-500/30 transition-all duration-500"
                                >
                                    {/* Header Section */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                                        <div className="space-y-1 w-full sm:w-auto">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-orange-500 font-black text-base">#{order._id.slice(-8).toUpperCase()}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color} ${statusConfig[order.status]?.border} flex items-center gap-1.5`}>
                                                    {statusConfig[order.status]?.icon} {order.status}
                                                </span>
                                                {['Pending', 'Preparing', 'Ready', 'Out for Delivery'].includes(order.status) && order.deliveryOtp && (
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500 text-white border border-orange-600 flex items-center gap-1.5 shadow-sm">
                                                        OTP: {order.deliveryOtp}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm font-bold flex items-center gap-2 mt-1">
                                                <FiClock size={14} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-2">
                                            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border ${payStyle[order.paymentStatus]} flex items-center gap-1.5`}>
                                                <FiCreditCard size={12} /> {order.paymentStatus}
                                            </span>
                                            <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                                                ₹{order.totalAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group/item">
                                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80'; }}
                                                        />
                                                        <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-lg">
                                                            {item.quantity}×
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-gray-900 dark:text-white text-sm sm:text-base truncate mb-1">{item.name}</h4>
                                                        <p className="font-bold text-orange-500 text-xs text-sm">₹{item.price.toFixed(2)} / item</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 sm:p-6 flex flex-col justify-center gap-3">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 rounded-2xl text-orange-500 shadow-sm border border-orange-500/10">
                                                    <FiMapPin size={20} sm={24} />
                                                </div>
                                                <div>
                                                    <h5 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Delivery Address</h5>
                                                    <p className="text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm leading-relaxed">{order.deliveryAddress}</p>
                                                </div>
                                            </div>
                                            {order.razorpayPaymentId && (
                                                <div className="flex items-center gap-2 mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                    Transaction ID: {order.razorpayPaymentId}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800 group/footer">
                                        <button
                                            onClick={() => generateInvoice(order)}
                                            className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
                                        >
                                            View Digital Invoice <FiArrowRight className="group-hover/footer:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleOrderAgain(order)}
                                            disabled={reorderingId === order._id}
                                            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-xl hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                        >
                                            {reorderingId === order._id ? 'REORDERING...' : 'ORDER AGAIN'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Orders;
