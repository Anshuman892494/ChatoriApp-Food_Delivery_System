import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation logic
        const { name, email, mobile, password } = form;

        if (name.length < 3 || name.length > 30) {
            return toast.error("Name must be between 3 and 30 characters");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address");
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return toast.error("Mobile number must be exactly 10 digits");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', form);
            login(data, data.token);
            toast.success(`Welcome, ${data.name}! 🎉`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    const fields = [
        { key: 'name', icon: <FiUser />, type: 'text', label: 'Full Name', placeholder: 'John Doe' },
        { key: 'email', icon: <FiMail />, type: 'email', label: 'Email Address', placeholder: 'you@example.com' },
        { key: 'mobile', icon: <FiPhone />, type: 'tel', label: 'Mobile Number', placeholder: '10-digit number', pattern: '[0-9]{10}', maxLength: 10 },
        { key: 'password', icon: <FiLock />, type: 'password', label: 'Password', placeholder: 'Min 6 characters', minLength: 6 },
    ];

    return (
        <div className="font-poppins min-h-screen bg-[url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex items-center justify-center p-4 pt-24 pb-12 relative">

            {/* Background Overlay */}
            <div className="absolute inset-0 bg-white/20 dark:bg-black/60 backdrop-blur-[2px]"></div>

            {/* Main Card Container */}
            <div className="relative z-10 w-full max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row-reverse min-h-[650px] border border-white/20">

                {/* ─── Right Side (Swapped for Register): Form ─── */}
                <div className="w-full lg:w-[55%] p-8 sm:p-14 flex flex-col justify-center">

                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create Account</h1>
                        <p className="text-sm sm:text-base text-gray-400 mt-2 sm:mt-3 font-medium">Join ChatoriApp and start ordering delicious food today.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {fields.map(f => (
                            <div key={f.key} className="flex flex-col gap-2 text-sm">
                                <label className="font-bold text-gray-700 dark:text-gray-300 ml-1">{f.label}</label>
                                <input
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    required
                                    minLength={f.minLength}
                                    maxLength={f.maxLength}
                                    pattern={f.pattern}
                                    className="w-full bg-[#F3F4F6] dark:bg-gray-800 border-2 border-transparent rounded-[16px] px-6 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 focus:border-orange-400 transition-all outline-none shadow-sm"
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-600 hover:bg-orange-700 cursor-pointer text-white font-extrabold py-4 rounded-[16px] transition-all shadow-lg shadow-orange-200 dark:shadow-none hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Creating account...' : 'Register Now'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-[13px] font-bold text-gray-500">
                        <span>Already have an account?{' '}</span>
                        <Link to="/login" className="text-orange-600 hover:text-orange-700 hover:underline ml-1">Login here</Link>
                    </div>
                </div>

                {/* ─── Left Side (Swapped for Register): Image Overlay ─── */}
                <div className="hidden lg:block w-[45%] relative overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
                        alt="Delicious Burger"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col justify-center items-center text-center p-12">
                        <h2 className="text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">Welcome Back!</h2>
                        <p className="text-white/90 text-sm mb-10 font-bold tracking-wide uppercase">Have an account already?</p>

                        <Link
                            to="/login"
                            className="bg-white hover:bg-gray-100 text-gray-900 font-extrabold px-12 py-4 rounded-[16px] transition-all transform hover:scale-105 active:scale-95 shadow-2xl inline-block"
                        >
                            Login Now
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
