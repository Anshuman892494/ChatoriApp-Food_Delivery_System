import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const initForm = { restaurantId: '', name: '', price: '', category: '', isAvailable: true, image: null };
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all";
const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const AdminItems = () => {
    const [foods, setFoods] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(initForm);
    const [saving, setSaving] = useState(false);

    const fetchAll = async () => {
        try {
            const [foodsRes, restRes] = await Promise.all([
                api.get('/admin/foods'),
                api.get('/admin/restaurants')
            ]);
            setFoods(foodsRes.data);
            setRestaurants(restRes.data);
        } catch (error) {
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchAll(); }, []);

    const openCreate = () => { setEditing(null); setForm(initForm); setShowModal(true); };
    const openEdit = (f) => {
        setEditing(f);
        setForm({
            restaurantId: f.restaurantId?._id || '',
            name: f.name,
            price: f.price,
            category: f.category,
            isAvailable: f.isAvailable,
            image: null
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('price', form.price);
            fd.append('category', form.category);
            fd.append('isAvailable', form.isAvailable);
            fd.append('restaurantId', form.restaurantId);
            if (form.image) fd.append('image', form.image);

            if (editing) {
                await api.put(`/admin/foods/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Food item updated');
            } else {
                await api.post(`/admin/foods`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Food item added');
            }
            setShowModal(false); fetchAll();
        } catch (err) { toast.error(err.response?.data?.message || 'Error saving item'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this food item completely?')) return;
        await api.delete(`/admin/foods/${id}`);
        toast.success('Deleted successfully'); fetchAll();
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">All Items (Global)</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and create food items across all restaurants</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-all shadow-md">
                    <FiPlus /> Add Item
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>{['Image', 'Name', 'Restaurant', 'Category', 'Price', 'Available', 'Actions'].map(h => (
                                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {foods.map(f => (
                                <tr key={f._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="px-5 py-3"><img src={f.image} alt={f.name} className="w-14 h-10 object-cover rounded-lg" /></td>
                                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">{f.name}</td>
                                    <td className="px-5 py-3 font-semibold text-orange-600 text-xs">
                                        <Link to={`/admin/restaurants/${f.restaurantId?._id}/foods`} className="hover:underline">
                                            {f.restaurantId?.name || 'Unknown'}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 text-xs">{f.category}</td>
                                    <td className="px-5 py-3 font-bold text-gray-800 dark:text-gray-200">₹{f.price}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {f.isAvailable ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(f)}
                                                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-all">
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(f._id)}
                                                className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {foods.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-sm border-t border-gray-100 dark:border-gray-800">No items found across any restaurants. Add one above!</div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-extrabold text-gray-900 dark:text-white">{editing ? 'Edit Global Item' : 'Add Item Globally'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className={labelCls}>Restaurant Profile</label>
                                <select className={inputCls}
                                    value={form.restaurantId}
                                    onChange={e => setForm({ ...form, restaurantId: e.target.value })}
                                    required={!editing}
                                    disabled={editing}>
                                    <option value="" disabled>-- Select Restaurant --</option>
                                    {restaurants.map(r => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div><label className={labelCls}>Name</label><input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className={labelCls}>Price (₹)</label><input className={inputCls} type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                                <div><label className={labelCls}>Category</label><input className={inputCls} placeholder="e.g. Burgers" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required /></div>
                            </div>
                            <div><label className={labelCls}>Image {editing ? '(optional)' : ''}</label>
                                <input className={inputCls} type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} {...(!editing ? { required: true } : {})} />
                            </div>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available to Order</span>
                            </label>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-orange-400 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving || (!editing && !form.restaurantId)}
                                    className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all">
                                    {saving ? 'Saving...' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminItems;
