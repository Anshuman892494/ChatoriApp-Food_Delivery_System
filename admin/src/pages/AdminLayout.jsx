import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiShoppingBag, FiPackage, FiLogOut, FiUsers, FiList } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    const navItems = [
        { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
        { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
        { to: '/admin/restaurants', icon: <FiShoppingBag />, label: 'Restaurants' },
        { to: '/admin/items', icon: <FiList />, label: 'Items' },
        { to: '/admin/orders', icon: <FiPackage />, label: 'Orders' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-poppins">
            {/* Sidebar */}
            <aside className="w-60 shrink-0 bg-gray-900 flex flex-col">
                {/* Brand */}
                <div className="px-6 py-5 flex items-center gap-2 border-b border-white/10">
                    <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-lg font-extrabold text-white">Chatori<span className="text-orange-500">App</span></span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(item => {
                        const active = pathname.startsWith(item.to);
                        return (
                            <Link key={item.to} to={item.to}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                                  ${active
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'text-gray-400 hover:bg-white/8 hover:text-white'}`}>
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 font-semibold truncate mb-3 px-2">{user?.name}</p>
                    <button onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-white/20 text-gray-400 text-sm font-semibold hover:border-orange-500 hover:text-orange-400 transition-all">
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
