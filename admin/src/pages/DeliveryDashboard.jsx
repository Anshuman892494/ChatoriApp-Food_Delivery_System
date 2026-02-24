import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import DeliveryLayout from '../components/DeliveryLayout';

const DeliveryDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otpModal, setOtpModal] = useState({ show: false, orderId: null });
    const [enteredOtp, setEnteredOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchAssignedOrders();
        const interval = setInterval(fetchAssignedOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAssignedOrders = async () => {
        try {
            const { data } = await api.get('/delivery/orders');
            setOrders(data || []);
        } catch (err) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, status) => {
        if (status === 'Delivered') {
            setOtpModal({ show: true, orderId });
            return;
        }

        try {
            await api.patch(`/delivery/order/${orderId}/status`, { status });
            toast.success(`Marked as ${status}`);
            fetchAssignedOrders();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (enteredOtp.length !== 6) return toast.error('Enter 6-digit OTP');

        setVerifying(true);
        try {
            await api.patch(`/delivery/order/${otpModal.orderId}/status`, {
                status: 'Delivered',
                otp: enteredOtp
            });
            toast.success('Delivery completed successfully! ✅');
            setOtpModal({ show: false, orderId: null });
            setEnteredOtp('');
            fetchAssignedOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const stats = {
        assigned: orders.filter(o => o.status === 'Ready').length,
        transit: orders.filter(o => o.status === 'Out for Delivery').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
    };

    const activeOrders = orders.filter(o => ['Ready', 'Out for Delivery'].includes(o.status));

    return (
        <DeliveryLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 font-poppins">
                <div className="max-w-7xl mx-auto">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        <StatCard icon={<FiPackage />} label="Assigned" value={stats.assigned} color="blue" />
                        <StatCard icon={<FiTruck />} label="In Transit" value={stats.transit} color="orange" />
                        <StatCard icon={<FiCheckCircle />} label="Completed" value={stats.delivered} color="green" />
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Active Tasks</h1>
                            <p className="text-sm text-gray-500 font-medium">Manage your currently assigned deliveries</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                    ) : activeOrders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                <FiPackage size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Tasks</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">Stay tuned! New delivery requests will appear here as they come in.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {activeOrders.map(order => (
                                <div key={order._id} className="bg-white dark:bg-gray-900 rounded-[32px] p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 block mb-1">Order ID</span>
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white font-mono uppercase">#{order._id.slice(-8)}</h3>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${order.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                                                <FiPackage size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer & Address</p>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{order.userId?.name || 'Customer'}</p>
                                                    <a href={`tel:${order.userId?.mobile}`} className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors">
                                                        📞 {order.userId?.mobile || 'No Mobile'}
                                                    </a>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed max-w-[250px]">{order.deliveryAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {order.status === 'Ready' && (
                                            <button
                                                onClick={() => updateStatus(order._id, 'Out for Delivery')}
                                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 text-xs tracking-widest uppercase"
                                            >
                                                Pick Up Order 🚀
                                            </button>
                                        )}
                                        {order.status === 'Out for Delivery' && (
                                            <button
                                                onClick={() => updateStatus(order._id, 'Delivered')}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-600/20 text-xs tracking-widest uppercase"
                                            >
                                                Delivered Successfully
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* OTP Verification Modal */}
            {otpModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-950 w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-3xl flex items-center justify-center mb-4 mx-auto text-3xl">
                                ✅
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Verify Delivery</h3>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Ask customer for the 6-digit OTP shown in their app</p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="Enter Order OTP"
                                value={enteredOtp}
                                onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center text-3xl font-black tracking-[0.4em] py-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-sm"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setOtpModal({ show: false, orderId: null }); setEnteredOtp(''); }}
                                    className="flex-1 py-4 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={verifying || enteredOtp.length !== 6}
                                    className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-600/20 uppercase tracking-widest text-xs disabled:opacity-50 transition-all"
                                >
                                    {verifying ? 'Verifying...' : 'Confirm Delivery'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DeliveryLayout>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
