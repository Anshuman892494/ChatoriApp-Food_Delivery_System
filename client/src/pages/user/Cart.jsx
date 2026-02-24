import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cart, updateQuantity, removeItem, cartTotal } = useCart();

    if (!cart.items || cart.items.length === 0)
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center text-gray-300 dark:text-gray-700 mb-6 shadow-inner"
                    >
                        <FiShoppingCart size={40} />
                    </motion.div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 text-center max-w-xs">Browse our top restaurants and add some delicious items to your feast!</p>
                    <Link to="/" className="px-8 py-3.5 rounded-2xl bg-orange-500 text-white font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 uppercase tracking-widest text-xs">
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-950 px-4 pb-20 relative overflow-hidden">
            {/* Decorative background orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -ml-48 -mb-48"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12 text-center pt-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4"
                    >
                        Your <span className="text-orange-500 underline decoration-orange-200 dark:decoration-orange-900/50 decoration-8 underline-offset-8">Cart</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 dark:text-gray-400 font-bold tracking-wide mt-5 uppercase text-xs"
                    >
                        Total {cart.items.length} Delicious Items Found
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.items.map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-4 sm:p-5 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-orange-500/20 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-gray-900 dark:text-white text-sm sm:text-lg truncate mb-1">{item.name}</h4>
                                            <p className="text-orange-500 font-black text-xs sm:text-sm">₹{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-3 sm:gap-3 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 hover:text-orange-500 shadow-sm transition-all active:scale-90">
                                                <FiMinus size={12} />
                                            </button>
                                            <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white w-5 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 hover:text-orange-500 shadow-sm transition-all active:scale-90">
                                                <FiPlus size={12} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            <button onClick={() => removeItem(item._id)}
                                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <FiTrash2 size={14} sm={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 h-fit sticky top-24"
                    >
                        <h3 className="font-black text-gray-900 dark:text-white text-xl mb-6 tracking-tight">Order Summary</h3>
                        <div className="space-y-4 text-sm font-bold">
                            <div className="flex justify-between text-gray-500">
                                <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="text-gray-900 dark:text-white text-base tracking-tighter">₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span className="uppercase tracking-widest text-[10px]">Delivery</span>
                                <span className="text-green-500 uppercase tracking-widest text-[10px]">Free</span>
                            </div>
                            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-end">
                                    <span className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-1">Grand Total</span>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <Link to="/checkout"
                            className="mt-8 flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                            Checkout <FiArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
