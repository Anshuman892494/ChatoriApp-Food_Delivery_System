import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

const Login = () => {
    const [form, setForm] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { uid, displayName, email, photoURL } = result.user;
            const { data } = await api.post('/auth/google', {
                uid,
                name: displayName,
                email,
                avatar: photoURL,
            });
            login(data, data.token);
            toast.success(`Welcome, ${data.name}! 🎉`);
            navigate('/');
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                toast.error(err.response?.data?.message || 'Google sign-in failed');
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation logic
        const { identifier, password } = form;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        const isEmail = emailRegex.test(identifier);
        const isMobile = mobileRegex.test(identifier);

        if (!isEmail && !isMobile) {
            return toast.error("Please enter a valid email or 10-digit mobile number");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login(data, data.token);
            toast.success(`Welcome back, ${data.name}!`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-poppins min-h-screen bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex items-center justify-center p-4 pt-24 pb-12 relative">

            {/* Background Overlay for Readability */}
            <div className="absolute inset-0 bg-white/20 dark:bg-black/60 backdrop-blur-[2px]"></div>

            {/* Main Card Container */}
            <div className="relative z-10 w-full max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[580px] border border-white/20">

                {/* ─── Left Side: Form ─── */}
                <div className="w-full lg:w-[55%] p-8 sm:p-14 flex flex-col justify-center">

                    <div className="mb-8 sm:mb-10">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Log in</h1>
                        <p className="text-sm sm:text-base text-gray-400 mt-3 font-medium">Welcome back! Please enter your details to continue.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                        {/* Email or Mobile */}
                        <div className="flex flex-col gap-2.5 text-sm">
                            <label className="font-bold text-gray-700 dark:text-gray-300 ml-1">Email or Mobile Number</label>
                            <input
                                type="text"
                                placeholder="Enter Your Email or Mobile"
                                value={form.identifier}
                                onChange={e => setForm({ ...form, identifier: e.target.value })}
                                required
                                className="w-full bg-[#F3F4F6] dark:bg-gray-800 border-2 border-transparent rounded-[16px] px-6 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 focus:border-orange-400 transition-all outline-none shadow-sm"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2.5 text-sm">
                            <div className="flex items-center justify-between ml-1">
                                <label className="font-bold text-gray-700 dark:text-gray-300">Password</label>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="w-full bg-[#F3F4F6] dark:bg-gray-800 border-2 border-transparent rounded-[16px] px-6 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 focus:border-orange-400 transition-all outline-none shadow-sm pr-14"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors p-1"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Buttons Row */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-4 rounded-[16px] transition-all shadow-lg shadow-orange-200 dark:shadow-none hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Logging in...' : 'Sign in'}
                            </button>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className="w-full sm:w-auto p-4 rounded-[16px] border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center disabled:opacity-70 group"
                            >
                                {googleLoading ? (
                                    <div className="animate-spin h-6 w-6 border-3 border-gray-300 border-t-orange-500 rounded-full" />
                                ) : (
                                    <div className="flex items-center gap-3 sm:gap-0">
                                        <FcGoogle size={26} className="group-hover:scale-110 transition-transform" />
                                        <span className="sm:hidden font-bold text-gray-700 dark:text-white">Sign in with Google</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center text-[13px] font-bold text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-orange-600 hover:text-orange-700 hover:underline">Register Now</Link>
                    </div>
                </div>

                {/* ─── Right Side: Image Overlay ─── */}
                <div className="hidden lg:block w-[45%] relative overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
                        alt="Pizza"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col justify-center items-center text-center p-12">
                        <h2 className="text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">Craving Something?</h2>
                        <p className="text-white/90 text-sm mb-10 font-bold tracking-wide uppercase">Let's get you started!</p>

                        <Link
                            to="/register"
                            className="bg-white hover:bg-gray-100 text-gray-900 font-extrabold px-12 py-4 rounded-[16px] transition-all transform hover:scale-105 active:scale-95 shadow-2xl inline-block"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
