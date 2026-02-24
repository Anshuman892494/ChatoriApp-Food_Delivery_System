import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminLayout from './AdminLayout';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/users')
            .then(({ data }) => setUsers(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return <AdminLayout><div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">User Management</h1>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            {['Name', 'Email', 'Role', 'Joined At'].map(h => (
                                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                <td className="px-5 py-4 font-bold text-gray-800 dark:text-gray-200">{u.name}</td>
                                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                                <td className="px-5 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
