import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiXCircle, FiArrowRight, FiRotateCcw, FiHome } from 'react-icons/fi';

const PaymentFailed = () => {
    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-950 px-4 pb-20 relative overflow-hidden flex items-center justify-center">
            {/* Decorative background orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100 dark:bg-red-900/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100 dark:bg-orange-900/10 rounded-full blur-[100px] pointer-events-none -ml-48 -mb-48"></div>

            <div className="max-w-xl w-full relative z-10">
                <header className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-[2rem] text-red-500 mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10"
                    >
                        <FiXCircle size={48} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4"
                    >
                        Payment <span className="text-red-500 underline decoration-red-200 dark:decoration-red-900/50 decoration-8 underline-offset-8">Failed</span>
                    </motion.h1>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400 font-bold text-base mb-10 leading-relaxed">
                        We couldn't process your transaction. This might be due to incorrect details or a connection issue. Don't worry, your cart is still safe and waiting for you!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/checkout"
                            className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest"
                        >
                            Try Again <FiRotateCcw size={18} />
                        </Link>
                        <Link
                            to="/"
                            className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-black hover:border-orange-500/30 hover:bg-orange-50/50 dark:hover:bg-gray-800/50 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            Back Home <FiHome size={18} />
                        </Link>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed">
                            Need help with your payment? <br />
                            <span className="text-orange-500 cursor-pointer hover:underline">Contact Support</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentFailed;
