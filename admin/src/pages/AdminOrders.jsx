import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusStyle = (s) =>
    s === 'Delivered' ? 'bg-green-100 text-green-700' :
        s === 'Cancelled' ? 'bg-red-100 text-red-700' :
            s === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700';

const payStyle = (s) =>
    s === 'Paid' ? 'bg-green-100 text-green-700' :
        s === 'Failed' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchOrders = () => {
            api.get('/admin/orders')
                .then(({ data }) => setOrders(data))
                .catch(err => console.error("Polling error:", err))
                .finally(() => setLoading(false));
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        await api.put(`/admin/orders/${id}/status`, { status });
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
        toast.success('Order status updated');
    };

    const filterOptions = ['All', ...STATUS_OPTIONS];
    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <AdminLayout>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">All Orders</h1>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                              ${filter === f
                                    ? 'bg-orange-500 border-orange-500 text-white'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-400 hover:text-orange-500'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Pay ID', 'Status', 'Update'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filtered.map(o => (
                                <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{o._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-gray-800 dark:text-gray-200">{o.userId?.name || '-'}</div>
                                        <div className="text-xs text-gray-400">{o.userId?.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {o.items.map((i, idx) => <div key={idx} className="text-xs text-gray-500">{i.name} × {i.quantity}</div>)}
                                    </td>
                                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-gray-200">₹{o.totalAmount.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">{o.paymentMethod}</div>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${payStyle(o.paymentStatus)}`}>{o.paymentStatus}</span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[10px] text-gray-400 max-w-[90px] break-all">{o.razorpayPaymentId || '-'}</td>
                                    <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(o.status)}`}>{o.status}</span></td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={o.status}
                                            onChange={e => updateStatus(o._id, e.target.value)}
                                            disabled={['Delivered', 'Cancelled'].includes(o.status)}
                                            className={`text-xs px-2 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all
                                              ${['Delivered', 'Cancelled'].includes(o.status)
                                                    ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed opacity-75'
                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                                                }`}
                                        >
                                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
