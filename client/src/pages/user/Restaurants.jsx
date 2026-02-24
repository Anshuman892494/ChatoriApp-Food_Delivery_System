import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiStar, FiClock, FiArrowRight, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ratingFor = (id) => (4.0 + ((id * 7) % 10) * 0.09).toFixed(1);

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        api.get('/restaurants')
            .then(r => setRestaurants(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(restaurants.map(r => r.category).filter(Boolean))];

    const filtered = restaurants.filter(r => {
        const q = search.toLowerCase();
        const matchSearch = r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q);
        const matchCat = activeCategory === 'All' ? true : r.category?.toLowerCase() === activeCategory.toLowerCase();
        return matchSearch && matchCat;
    });

    const Spinner = () => (
        <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100 dark:bg-orange-950/20 rounded-full blur-[120px] pointer-events-none -mr-48 -mt-48 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-950/20 rounded-full blur-[120px] pointer-events-none -ml-48 -mb-48 opacity-30"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header Section */}
                <header className="mb-12 sm:mb-20 pt-10">
                    <div className="text-center mb-10 sm:mb-12 px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
                        >
                            Explore All <span className="text-orange-500 underline decoration-orange-200 dark:decoration-orange-900/50 decoration-8 underline-offset-8">Flavors</span>
                        </motion.h1>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-lg font-medium max-w-2xl mx-auto">
                            Handpicked restaurants for an amazing experience. Discover the city's hidden gems and global favorites.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto mb-10 sm:mb-20 px-2 sm:px-4"
                    >
                        {/* Search Bar - Premium Glassmorphism */}
                        <div className="flex items-center w-full bg-gray-100 dark:bg-gray-900 rounded-[2.5rem] border-2 border-transparent focus-within:border-orange-500/50 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-2xl focus-within:shadow-orange-500/10 transition-all duration-500 overflow-hidden px-2 py-2">
                            <FiSearch className="ml-4 sm:ml-6 text-lg sm:text-xl text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, cuisine..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 font-bold text-sm sm:text-base"
                            />
                            <button className="hidden sm:block px-8 py-3 bg-orange-500 text-white font-black rounded-[1.8rem] hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/20">
                                Search
                            </button>
                        </div>
                    </motion.div>
                </header>

                {loading ? <Spinner /> : (
                    <AnimatePresence mode="popLayout">
                        {filtered.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-32 bg-gray-50 dark:bg-gray-900/50 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-800"
                            >
                                <div className="text-8xl mb-6">🛸</div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Far from here...</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">We couldn't find any matches. Try adjusting your search or filters.</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {filtered.map((r, i) => (
                                    <motion.div
                                        key={r._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none border-2 border-transparent hover:border-orange-500 transition-all duration-500"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={r.image}
                                                alt={r.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                                <span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest">
                                                    {r.category || 'Restaurant'}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-black text-white text-xl tracking-tight leading-none">{r.name}</h3>
                                                    <span className="bg-white/20 backdrop-blur-md text-white font-black text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                                        <FiStar className="fill-white" size={10} /> {ratingFor(r._id?.charCodeAt(0) || 1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 flex-1 flex flex-col">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-6 line-clamp-1 flex items-center gap-2">
                                                <FiMapPin size={14} className="text-orange-500" /> {r.address.split(',')[0]}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="flex items-center gap-1.5 text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                                    <FiClock size={16} className="text-orange-500" /> 25-35 MIN
                                                </span>
                                                <Link
                                                    to={`/restaurant/${r._id}`}
                                                    className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-orange-500 group-hover:text-white transition-all duration-300"
                                                >
                                                    <FiArrowRight size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Restaurants;
