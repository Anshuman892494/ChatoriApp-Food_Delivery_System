import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiSearch, FiMapPin, FiArrowRight,
    FiClock, FiStar, FiTruck, FiShield, FiThumbsUp,
    FiNavigation
} from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import logo from '../../assets/logo.png';
import api from '../../api/axios';
const HERO_SLIDES = [
    {
        title: "Burger Cravings? Sorted.",
        motto: "Stacked, Juicy & Loaded.",
        desc: "Double patties, extra cheese, and secret sauces — every bite is pure happiness.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80",
        badge: "🍔 Best-Selling Burgers"
    },
    {
        title: "Crispy. Crunchy. Crazy Good.",
        motto: "Fries That Hit Different.",
        desc: "Golden fries, peri-peri wedges, and spicy nuggets that make every snack time epic.",
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1600&q=80",
        badge: "🍟 Fan Favorites"
    },
    {
        title: "Shakes, Wraps & More",
        motto: "Snack Hard, Chill Harder.",
        desc: "Creamy milkshakes, loaded wraps, and combos made for your hunger mood.",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1600&q=80",
        badge: "🥤 Combo Deals"
    }
];

const HOW_IT_WORKS = [
    { icon: <FiSearch />, step: '01', title: 'Choose Your Food', desc: 'Browse restaurants and pick your favourite dishes from our wide selection.' },
    { icon: <FiTruck />, step: '02', title: 'Fast Delivery', desc: 'We deliver your food hot and fresh, right to your doorstep within minutes.' },
    { icon: <FiThumbsUp />, step: '03', title: 'Enjoy Your Meal', desc: 'Sit back, relax, and enjoy a delicious meal delivered with love.' },
];

const ratingFor = (id) => (4.0 + ((id * 7) % 10) * 0.09).toFixed(1);
const timeFor = (id) => `${20 + ((id * 3) % 20)}–${35 + ((id * 3) % 15)} min`;

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeDishCategory, setActiveDishCategory] = useState('All');

    useEffect(() => {
        api.get('/restaurants').then(r => setRestaurants(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        api.get('/restaurants/popular-foods').then(r => setPopularItems(r.data)).catch(console.error).finally(() => setItemsLoading(false));
    }, []);

    const filtered = restaurants.filter(r => {
        const matchCat = activeCategory ? r.category && r.category.toLowerCase().includes(activeCategory.toLowerCase()) : true;
        return matchCat;
    });
    const featured = restaurants.slice(0, 4);

    const dishCategories = ['All', ...new Set(popularItems.map(item => item.category).filter(Boolean))];
    const filteredDishes = activeDishCategory === 'All'
        ? popularItems
        : popularItems.filter(item => item.category === activeDishCategory);

    const Spinner = () => <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="font-poppins bg-gray-50 dark:bg-gray-950 overflow-x-hidden">

            {/* ══ HERO SLIDESHOW ══ */}
            <section className="relative h-[70vh] sm:h-[90vh] w-full mt-20 overflow-hidden">
                <Swiper
                    modules={[Autoplay, EffectFade, Navigation, Pagination]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    loop={true}
                    observer={true}
                    observeParents={true}
                    slidesPerView={1}
                    className="h-full w-full"
                >
                    {HERO_SLIDES.map((slide, idx) => (
                        <SwiperSlide key={idx} className="relative h-full w-full">
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 z-0">
                                <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="max-w-2xl text-center sm:text-left"
                                >
                                    <span className="inline-flex items-center gap-2 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider mx-auto sm:mx-0">
                                        {slide.badge}
                                    </span>
                                    <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-4">
                                        {slide.title.split(' ').map((word, i) => (
                                            <span key={i} className={word === 'Tasty' || word === 'Food' ? "text-orange-500" : ""}>{word}{' '}</span>
                                        ))}
                                    </h1>
                                    <h2 className="text-lg sm:text-2xl font-bold text-orange-400 mb-6 italic">
                                        "{slide.motto}"
                                    </h2>
                                    <p className="text-gray-200 text-xs sm:text-lg mb-10 leading-relaxed max-w-lg mx-auto sm:mx-0">
                                        {slide.desc}
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 w-full">
                                        <Link to="/restaurants" className="w-full sm:w-auto px-10 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/30 text-center text-sm sm:text-base">
                                            Explore Menu
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* ══ UNIQUE UI: LIVE STATS TICKER ══ */}
            <section className="py-10 bg-gray-900 border-y border-gray-800 relative z-20 overflow-hidden">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 px-6">
                            <span className="flex items-center gap-3 text-white text-sm font-black uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 100+ Happy Foodies
                            </span>
                            <span className="flex items-center gap-3 text-white text-sm font-black uppercase tracking-[0.3em]">
                                <span className="inline-block p-1 bg-orange-500 rounded-lg"><FiTruck size={14} /></span> Lightning Fast Delivery
                            </span>
                            <span className="flex items-center gap-3 text-white text-sm font-black uppercase tracking-[0.3em]">
                                <span className="inline-block p-1 bg-orange-500 rounded-lg"><FiThumbsUp size={14} /></span> 4.8 Rating
                            </span>
                            <span className="flex items-center gap-3 text-white text-sm font-black uppercase tracking-[0.3em]">
                                <span className="inline-block p-1 bg-orange-500 rounded-lg"><FiShield size={14} /></span> Verified Safe & Hygienic
                            </span>
                        </div>
                    ))}
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        display: inline-flex;
                        animation: marquee 40s linear infinite;
                    }
                `}} />
            </section>

            {/* ══ POPULAR DISHES ══ */}
            <section className="py-12 sm:py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
                {/* Decorative background orb */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100 dark:bg-orange-900/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4"
                        >
                            Most <span className="text-orange-500 underline decoration-orange-200 decoration-8 underline-offset-8">Loved</span> Dishes
                        </motion.h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Explore the flavors that everyone is talking about.</p>

                        {!itemsLoading && dishCategories.length > 1 && (
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8">
                                {dishCategories.map((cat, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => setActiveDishCategory(cat)}
                                        className={`px-6 py-2.5 rounded-[1.5rem] text-sm font-black transition-all ${activeDishCategory === cat
                                                ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30 scale-105'
                                                : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-500 shadow-lg shadow-gray-200/50 dark:shadow-none border border-transparent hover:border-orange-500/20'
                                            }`}
                                    >
                                        {cat}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {itemsLoading ? <Spinner /> : filteredDishes.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
                            <div className="text-6xl mb-4">🍽️</div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No dishes found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-base">We couldn't find any dishes in this category.</p>
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredDishes.map((item, i) => (
                                    <motion.div
                                        layout
                                        key={item._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-orange-500/30 transition-all duration-500"
                                    >
                                        <div className="relative h-56 overflow-hidden">
                                            <img src={item.image} alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'; }} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <button className="absolute bottom-4 right-4 bg-orange-500 text-white p-3 rounded-2xl shadow-xl transform translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                                                <FiArrowRight size={20} />
                                            </button>
                                        </div>
                                        <div className="p-7">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-orange-500 transition-colors">{item.name}</h4>
                                                <span className="flex items-center gap-1 text-orange-500 font-black text-sm"><FiStar className="fill-orange-500" size={14} /> {ratingFor(item._id?.charCodeAt(0) || 1)}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2 font-bold">
                                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                                {item.restaurantId?.name}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Price</span>
                                                    <span className="text-2xl font-black text-gray-900 dark:text-white">₹{item.price}</span>
                                                </div>
                                                <Link to={`/restaurant/${item.restaurantId?._id}`} className="px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black hover:bg-orange-50 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-lg active:scale-95">
                                                    ORDER NOW
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ══ HOW IT WORKS ══ */}
            <section className="py-12 sm:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">How It <span className="text-orange-500">Works</span></h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Simple steps to get your favorite food delivered.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {HOW_IT_WORKS.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative group"
                            >
                                <div className="w-24 h-24 rounded-[2rem] bg-orange-500 text-white flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-500">{h.icon}</div>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{h.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{h.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ BRAND DESCRIPTION SECTION ══ */}
            <section className="py-12 sm:py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
                        {/* Left Side: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 lg:mb-8 leading-[1.1]">
                                Experience the <span className="text-orange-500">ChatoriApp</span> Difference
                            </h2>
                            <div className="space-y-6">
                                <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl font-medium leading-relaxed">
                                    ChatoriApp is more than just a food delivery service. We are a bridge between you and your favorite local flavors.
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed">
                                    With our lightning-fast delivery and a curated selection of the best restaurants, we ensure that every meal is an unforgettable experience.
                                </p>
                            </div>
                        </motion.div>

                        {/* Right Side: Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                            className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
                        >
                            {/* Decorative Blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

                            <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-white dark:bg-gray-900 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl flex items-center justify-center p-8 lg:p-12 border border-gray-100 dark:border-gray-800 relative group">
                                <img
                                    src={logo}
                                    alt="ChatoriApp Logo"
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Bottom Floating Badge */}
                                <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-orange-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl shadow-xl shadow-orange-500/30 transform rotate-3">
                                    <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">Quality Guaranteed</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ FEATURED RESTAURANTS ══ */}
            {!loading && featured.length > 0 && (
                <section className="py-12 sm:py-24 bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-end justify-between mb-12 lg:mb-16">
                            <div className="text-center sm:text-left w-full sm:w-auto">
                                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">Featured <span className="text-orange-500">Places</span></h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium">Handpicked restaurants for an amazing experience.</p>
                            </div>
                            <div className="hidden sm:block">
                                <Link to="/restaurants" className="flex items-center gap-2 text-orange-500 font-black tracking-widest hover:gap-4 transition-all uppercase text-sm">
                                    View All <FiArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featured.map((r, i) => (
                                <motion.div
                                    key={r._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none border-2 border-transparent hover:border-orange-500 transition-all duration-500"
                                >
                                    <div className="relative h-60 overflow-hidden">
                                        <img src={r.image}
                                            alt={r.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'; }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest">
                                                {i === 0 ? '30% OFF' : i === 1 ? 'Free Delivery' : i === 2 ? 'Top Rated' : 'Exclusive'}
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
                                    <div className="p-8">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-6 line-clamp-1 flex items-center gap-2">
                                            <FiMapPin size={14} className="text-orange-500" /> {r.address.split(',')[0]}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1.5 text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter"><FiClock size={14} className="text-orange-500" /> 25-35 MIN</span>
                                            </div>
                                            <Link to={`/restaurant/${r._id}`} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                                <FiArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══ ALL RESTAURANTS ══ */}
            <section className="py-12 sm:py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">Our <span className="text-orange-500">Restaurants</span></h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {loading ? 'Fetching restaurants…' : `${filtered.length} total restaurants found`}
                                {activeCategory && <span className="text-orange-500 ml-2">filtered by {activeCategory}</span>}
                            </p>
                        </div>
                        {activeCategory && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setActiveCategory(null)}
                                className="px-8 py-4 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-sm font-black uppercase tracking-wider hover:bg-orange-200 dark:hover:bg-orange-900 transition-all border-none"
                            >
                                Reset Filters
                            </motion.button>
                        )}
                    </div>

                    {loading ? <Spinner /> : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 bg-gray-50 dark:bg-gray-800/30 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-gray-800"
                        >
                            <div className="text-8xl mb-6">🏜️</div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">No matching spots</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">We couldn't find what you're looking for. Try a broader search.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filtered.map((r, i) => (
                                <motion.div
                                    key={r._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group flex flex-col sm:flex-row bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] overflow-hidden hover:bg-white dark:hover:bg-gray-700 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none border border-transparent hover:border-orange-500/20 transition-all duration-500"
                                >
                                    <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                                        <img src={r.image}
                                            alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80'; }} />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-lg">LIVE</span>
                                        </div>
                                    </div>
                                    <div className="p-7 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-black text-gray-900 dark:text-white text-xl tracking-tight leading-tight group-hover:text-orange-500 transition-colors">{r.name}</h3>
                                            <span className="flex items-center gap-1 text-orange-500 font-black text-sm shrink-0 ml-4"><FiStar className="fill-orange-500" size={14} />{ratingFor(r._id?.charCodeAt(0) || 1)}</span>
                                        </div>
                                        <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Highly Recommended</p>
                                        <div className="flex flex-col gap-2 mb-6">
                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400"><FiMapPin size={14} className="text-orange-200" /> {r.address.split(',').slice(0, 1)}</span>
                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400"><FiClock size={14} className="text-orange-200" /> 20-30 MIN DELIVERY</span>
                                        </div>
                                        <Link to={`/restaurant/${r._id}`}
                                            className="mt-auto flex items-center justify-center gap-3 w-full py-4 rounded-[1.2rem] bg-gray-900 dark:bg-gray-700 text-white text-sm font-black hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/30 transition-all active:scale-95 uppercase tracking-widest">
                                            Menu <FiArrowRight size={16} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
