import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const initForm = { name: '', description: '', address: '', isActive: true, image: null };

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all";
const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(initForm);
    const [saving, setSaving] = useState(false);

    const fetchAll = () => api.get('/admin/restaurants').then(({ data }) => setRestaurants(data)).finally(() => setLoading(false));
    useEffect(() => { fetchAll(); }, []);

    const openCreate = () => { setEditing(null); setForm(initForm); setShowModal(true); };
    const openEdit = (r) => { setEditing(r); setForm({ name: r.name, description: r.description, address: r.address, isActive: r.isActive, image: null }); setShowModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const fd = new FormData();
            ['name', 'description', 'address'].forEach(k => fd.append(k, form[k]));
            fd.append('isActive', form.isActive);
            if (form.image) fd.append('image', form.image);
            if (editing) {
                await api.put(`/admin/restaurants/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Restaurant updated');
            } else {
                await api.post('/admin/restaurants', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Restaurant created');
            }
            setShowModal(false); fetchAll();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this restaurant?')) return;
        await api.delete(`/admin/restaurants/${id}`);
        toast.success('Deleted'); fetchAll();
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Restaurants</h1>
                <button onClick={openCreate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-all shadow-md">
                    <FiPlus /> Add Restaurant
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>{['Image', 'Name', 'Address', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {restaurants.map(r => (
                                <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="px-5 py-3"><img src={r.image} alt={r.name} className="w-14 h-10 object-cover rounded-lg" /></td>
                                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">{r.name}</td>
                                    <td className="px-5 py-3 text-gray-500 text-xs">{r.address}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {r.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(r)}
                                                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-all">
                                                <FiEdit2 size={14} />
                                            </button>
                                            <Link to={`/admin/restaurants/${r._id}/foods`}
                                                className="px-2.5 py-1 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-all">
                                                Foods
                                            </Link>
                                            <button onClick={() => handleDelete(r._id)}
                                                className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-extrabold text-gray-900 dark:text-white">{editing ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {[{ key: 'name', label: 'Name', type: 'text' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'address', label: 'Address', type: 'text' }].map(f => (
                                <div key={f.key}>
                                    <label className={labelCls}>{f.label}</label>
                                    {f.type === 'textarea'
                                        ? <textarea className={inputCls} rows={2} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
                                        : <input className={inputCls} type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
                                    }
                                </div>
                            ))}
                            <div>
                                <label className={labelCls}>Image {editing ? '(optional)' : ''}</label>
                                <input className={inputCls} type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} {...(!editing ? { required: true } : {})} />
                            </div>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active</span>
                            </label>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-orange-400 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all">
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Restaurants;
