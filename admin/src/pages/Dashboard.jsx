import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminLayout from './AdminLayout';

const statusStyle = (s) => s === 'Delivered' ? 'bg-green-100 text-green-700' : s === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
const payStyle = (s) => s === 'Paid' ? 'bg-green-100 text-green-700' : s === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600';

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, restaurants: 0, revenue: 0, pending: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = () => {
            Promise.all([
                api.get('/admin/orders'),
                api.get('/admin/restaurants'),
                api.get('/admin/users')
            ]).then(([ordersRes, restRes, usersRes]) => {
                const orders = ordersRes.data;
                const restaurants = restRes.data;
                const users = usersRes.data;
                const revenue = orders.filter(o => o.paymentMethod !== 'COD' && o.paymentStatus === 'Paid').reduce((a, o) => a + o.totalAmount, 0);
                const codRevenue = orders.filter(o => o.paymentMethod === 'COD').reduce((a, o) => a + o.totalAmount, 0);
                const pending = orders.filter(o => o.status === 'Pending').length;
                setStats({ users: users.length, orders: orders.length, restaurants: restaurants.length, revenue, codRevenue, pending });
                setRecentOrders(orders.slice(0, 5));
            }).finally(() => setLoading(false));
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading)
        return <AdminLayout><div className="flex items-center justify-center h-60"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

    const statCards = [
        { label: 'Total Users', value: stats.users, icon: '👥', bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600' },
        { label: 'Total Orders', value: stats.orders, icon: '📦', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600' },
        { label: 'Revenue (Online)', value: `₹${stats.revenue.toFixed(2)}`, icon: '💳', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600' },
        { label: 'Revenue (COD)', value: `₹${stats.codRevenue.toFixed(2)}`, icon: '🚚', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600' },
    ];

    return (
        <AdminLayout>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Dashboard</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map(s => (
                    <div key={s.label} className={`rounded-2xl p-5 ${s.bg} border border-gray-100 dark:border-gray-800`}>
                        <div className="text-3xl mb-2">{s.icon}</div>
                        <div className={`text-2xl font-extrabold ${s.text}`}>{s.value}</div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="font-extrabold text-gray-900 dark:text-white">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                {['Order ID', 'Customer', 'Amount', 'Method', 'Status', 'Payment'].map(h => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {recentOrders.map(o => (
                                <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-gray-500">#{o._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-200">{o.userId?.name || '-'}</td>
                                    <td className="px-5 py-3 font-bold text-gray-800 dark:text-gray-200">₹{o.totalAmount.toFixed(2)}</td>
                                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{o.paymentMethod}</td>
                                    <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(o.status)}`}>{o.status}</span></td>
                                    <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payStyle(o.paymentStatus)}`}>{o.paymentStatus}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
