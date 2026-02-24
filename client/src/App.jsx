import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, GuestRoute } from './components/RouteGuards';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

// User pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import RestaurantMenu from './pages/user/RestaurantMenu';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import PaymentSuccess from './pages/user/PaymentSuccess';
import PaymentFailed from './pages/user/PaymentFailed';
import UserProfile from './pages/user/UserProfile';
import Restaurants from './pages/user/Restaurants';
import StaticPage from './pages/user/StaticPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(31, 41, 55, 0.95)',
                  color: '#fff',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '16px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                  maxWidth: '450px',
                },
                success: {
                  iconTheme: { primary: '#f97316', secondary: '#fff' },
                  style: { borderLeft: '6px solid #f97316' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  style: { borderLeft: '6px solid #ef4444' },
                },
              }}
            />
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/restaurants" element={<Restaurants />} />

        {/* Protected User Routes */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* Static Pages */}
        <Route path="/about" element={<StaticPage title="About Us" />} />
        <Route path="/careers" element={<StaticPage title="Careers" />} />
        <Route path="/blog" element={<StaticPage title="Blog" />} />
        <Route path="/partner" element={<StaticPage title="Partner with us" />} />
        <Route path="/terms" element={<StaticPage title="Terms & Conditions" />} />
        <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
        <Route path="/cookie-policy" element={<StaticPage title="Cookie Policy" />} />
        <Route path="/refund-policy" element={<StaticPage title="Refund Policy" />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
