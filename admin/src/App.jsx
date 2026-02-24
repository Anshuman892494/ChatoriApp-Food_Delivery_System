import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminRoute, DeliveryRoute, GuestRoute } from './components/RouteGuards';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import Foods from './pages/Foods';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminItems from './pages/AdminItems';

// Delivery pages
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e1f2b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/restaurants" element={<AdminRoute><Restaurants /></AdminRoute>} />
      <Route path="/admin/restaurants/:id/foods" element={<AdminRoute><Foods /></AdminRoute>} />
      <Route path="/admin/items" element={<AdminRoute><AdminItems /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

      {/* Delivery Routes */}
      <Route path="/delivery/login" element={<GuestRoute><DeliveryLogin /></GuestRoute>} />
      <Route path="/delivery/dashboard" element={<DeliveryRoute><DeliveryDashboard /></DeliveryRoute>} />

      {/* Defaults & Redirects */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default App;
