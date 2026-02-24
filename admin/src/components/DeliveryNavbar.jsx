import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiLogOut, FiUser, FiList, FiSun, FiMoon } from 'react-icons/fi';

const DeliveryNavbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/delivery/login'); };
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

                {/* Brand */}
                <Link to="/delivery/dashboard" className="flex items-center gap-2 text-xl font-extrabold shrink-0">
                    <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-gray-900 dark:text-white">Chatori<span className="text-orange-500">App</span></span>
                </Link>

                {/* Center nav links */}
                {user && (
                    <div className="hidden sm:flex items-center gap-1">
                        <Link to="/delivery/dashboard"
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all
                              ${isActive('/delivery/dashboard') ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            Dashboard
                        </Link>
                    </div>
                )}

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                        aria-label="Toggle theme"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 transition-all text-lg"
                    >
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                    </button>

                    {user ? (
                        <>
                            {/* User chip */}
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <FiUser className="text-orange-500" />
                                <span>{user.name.split(' ')[0]}</span>
                            </div>
                            {/* Logout */}
                            <button onClick={handleLogout}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all">
                                <FiLogOut /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/delivery/login" className="px-4 py-1.5 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default DeliveryNavbar;
