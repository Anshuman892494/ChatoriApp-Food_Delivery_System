import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                mobile: user.mobile
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (form.name.length < 3 || form.name.length > 30) {
            return toast.error("Name must be between 3 and 30 characters");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return toast.error("Invalid email format");
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (form.mobile && !mobileRegex.test(form.mobile)) {
            return toast.error("Mobile number must be 10 digits");
        }

        if (form.password) {
            if (form.password.length < 6) {
                return toast.error("Password must be at least 6 characters");
            }
            if (form.password !== form.confirmPassword) {
                return toast.error("Passwords do not match");
            }
        }

        setLoading(true);
        try {
            const updateData = {
                name: form.name,
                email: form.email,
                mobile: form.mobile
            };
            if (form.password) updateData.password = form.password;

            const { data } = await api.put('/auth/profile', updateData);
            login(data, data.token);
            toast.success("Profile updated successfully!");
            setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold mb-8 transition-colors"
                >
                    <FiArrowLeft /> Back
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 text-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center text-2xl sm:text-3xl text-white font-black shadow-lg shadow-orange-500/30">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">{user?.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-sm font-medium mb-4 sm:mb-6 uppercase tracking-widest">{user?.role}</p>

                            <div className="space-y-3 sm:space-y-4 text-left border-t border-gray-100 dark:border-gray-800 pt-5 sm:pt-6">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <FiMail className="text-orange-500 shrink-0" />
                                    <span className="text-xs sm:text-sm font-bold truncate">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <FiPhone className="text-orange-500 shrink-0" />
                                    <span className="text-xs sm:text-sm font-bold">{user?.mobile}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">Edit Profile</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-orange-500/20 focus:bg-white dark:focus:bg-gray-700 rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white"
                                                placeholder="Your Name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-orange-500/20 focus:bg-white dark:focus:bg-gray-700 rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white"
                                                placeholder="Email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="relative group">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="mobile"
                                                value={form.mobile}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-orange-500/20 focus:bg-white dark:focus:bg-gray-700 rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white"
                                                placeholder="Mobile"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Change Password</h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                            <div className="relative group">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-orange-500/20 focus:bg-white dark:focus:bg-gray-700 rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                            <div className="relative group">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={form.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-orange-500/20 focus:bg-white dark:focus:bg-gray-700 rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-orange-500 text-white font-black rounded-3xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <><FiSave size={20} /> Save Changes</>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
