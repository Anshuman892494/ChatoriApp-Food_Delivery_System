import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user) { setCart({ items: [] }); return; }
        try {
            const { data } = await api.get('/cart');
            setCart(data);
        } catch (err) {
            setCart({ items: [] });
        }
    };

    useEffect(() => { fetchCart(); }, [user]);

    const addToCart = async (food) => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await api.post('/cart', {
                foodId: food._id,
                name: food.name,
                image: food.image,
                price: food.price,
                quantity: 1,
            });
            setCart(data);
        } finally { setLoading(false); }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return removeItem(itemId);
        const { data } = await api.put(`/cart/${itemId}`, { quantity });
        setCart(data);
    };

    const removeItem = async (itemId) => {
        const { data } = await api.delete(`/cart/${itemId}`);
        setCart(data);
    };

    const clearCart = async () => {
        await api.delete('/cart/clear');
        setCart({ items: [] });
    };

    const cartTotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const cartCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, cartTotal, cartCount, loading, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
