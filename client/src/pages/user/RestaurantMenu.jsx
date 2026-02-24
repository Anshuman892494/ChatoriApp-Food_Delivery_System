import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiTag } from 'react-icons/fi';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const [restRes, foodsRes] = await Promise.all([
                api.get('/restaurants'),
                api.get(`/restaurants/${id}/foods`),
            ]);
            setRestaurant(restRes.data.find(r => r._id === id));
            setFoods(foodsRes.data);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const categories = ['All', ...new Set(foods.map(f => f.category))];
    const filtered = category === 'All' ? foods : foods.filter(f => f.category === category);

    const handleAddToCart = async (food) => {
        if (!user) { toast.error('Please login to add items to cart'); return; }
        await addToCart(food);
        toast.success(`${food.name} added to cart`);
    };

    if (loading)
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-950 pb-12">
            {/* Hero */}
            {restaurant && (
                <div className="relative h-44 sm:h-64 overflow-hidden">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-4 sm:py-5">
                        <h1 className="text-xl sm:text-3xl font-extrabold text-white">{restaurant.name}</h1>
                        <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-1">{restaurant.description}</p>
                        <span className="inline-flex items-center gap-1 text-white/70 text-[10px] sm:text-xs mt-2">📍 {restaurant.address}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 mt-6">
                {/* Category tabs */}
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-6">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0
                              ${category === cat
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-400 hover:text-orange-500'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">🍽️</div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">No items in this category</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filtered.map(food => (
                            <div key={food._id}
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-1 hover:shadow-md transition-all">
                                {/* Image */}
                                <div className="relative h-44 overflow-hidden">
                                    <img src={food.image} alt={food.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-400" />
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 text-orange-500 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                                        <FiTag size={10} /> {food.category}
                                    </div>
                                </div>
                                {/* Info */}
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{food.name}</h4>
                                    <div className="text-orange-500 font-extrabold text-lg mb-3">₹{food.price}</div>
                                    <button onClick={() => handleAddToCart(food)}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-all">
                                        <FiShoppingCart size={14} /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantMenu;
