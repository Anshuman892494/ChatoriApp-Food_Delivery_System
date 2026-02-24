import { useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiTruck } from 'react-icons/fi';

const AdminLogin = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/admin/login', form);
            login(data, data.token);
            toast.success('Swagat hai, Admin!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="font-poppins min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-4">

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[400px] bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-8 sm:p-10 border border-gray-100"
            >
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-black text-gray-900 tracking-tight">
                            Chatori<span className="text-orange-600">App</span>
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-[#1a1c23] mb-1 tracking-tight">Log in</h2>
                    <p className="text-gray-400 font-medium text-xs tracking-wide">
                        ADMIN PORTAL ACCESS
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-[#1a1c23] ml-1 uppercase tracking-widest">Email or Mobile</label>
                        <input
                            type="email"
                            placeholder="e.g. admin@chatori.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl bg-[#f5f6f8] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-orange-600/5 focus:outline-none transition-all font-medium border-2 border-transparent focus:border-orange-600/10 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[11px] font-black text-[#1a1c23] uppercase tracking-widest">Password</label>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-xl bg-[#f5f6f8] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-orange-600/5 focus:outline-none transition-all font-medium border-2 border-transparent focus:border-orange-600/10 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:scale-[1.01] active:scale-[0.99] text-sm flex items-center justify-center disabled:opacity-70 mt-4 tracking-wider"
                    >
                        {loading ? <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : "SIGN IN TO DASHBOARD"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm font-medium text-gray-500">Are you a delivery partner?</p>
                    <Link to="/delivery/login" className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-xs font-bold transition-all">
                        <FiTruck size={14} className="text-orange-600" /> Switch to Delivery Portal
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
