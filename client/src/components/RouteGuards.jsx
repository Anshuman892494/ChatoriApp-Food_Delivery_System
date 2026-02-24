import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="spinner" />;
    return user ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="spinner" />;
    if (!user) return <Navigate to="/admin/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
};

export const DeliveryRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="spinner" />;
    if (!user) return <Navigate to="/delivery/login" replace />;
    if (user.role !== 'delivery') return <Navigate to="/" replace />;
    return children;
};

export const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="spinner" />;
    return !user ? children : <Navigate to="/" replace />;
};
