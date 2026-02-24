import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiLogOut, FiUser, FiList, FiSun, FiMoon, FiNavigation } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); setIsMenuOpen(false); };
    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/', icon: null },
        { name: 'Restaurants', path: '/restaurants', icon: <FiNavigation /> },
        { name: 'Orders', path: '/orders', icon: <FiList /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">

                {/* Left: Mobile Menu Toggle & Brand */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 sm:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        {isMenuOpen ? <FiLogOut className="rotate-90" /> : <FiList size={24} />}
                    </button>
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-xl font-extrabold shrink-0">
                        <img src={logo} alt="Logo" className="w-8 h-8 object-contain hover:scale-110 transition-transform duration-300" />
                        <span className="text-gray-900 dark:text-white">Chatori<span className="text-orange-500">App</span></span>
                    </Link>
                </div>

                {/* Center nav links (Desktop) */}
                {user && (
                    <div className="hidden sm:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all
                                ${isActive(link.path) ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                {link.icon} {link.name}
                            </Link>
                        ))}
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
                            {/* Cart */}
                            <Link to="/cart" className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 transition-all text-lg" title="Cart">
                                <FiShoppingCart />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            {/* User Profile Link (Desktop) */}
                            <Link to="/profile" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all">
                                <FiUser className="text-orange-500" />
                                <span>{user.name.split(' ')[0]}</span>
                            </Link>
                            {/* Logout (Desktop) */}
                            <button onClick={handleLogout}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all">
                                <FiLogOut /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-4 py-1.5 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                Login
                            </Link>
                            <Link to="/register" className="px-4 py-1.5 rounded-full text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="sm:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in slide-in-from-top duration-300">
                    <div className="p-4 space-y-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl mb-4">
                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                        <FiUser />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all
                                        ${isActive(link.path) ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                        {link.icon || <FiNavigation />} {link.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all
                                    ${isActive('/profile') ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                    <FiUser /> Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                >
                                    <FiLogOut /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-center rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-center rounded-xl text-sm font-bold bg-orange-500 text-white">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
