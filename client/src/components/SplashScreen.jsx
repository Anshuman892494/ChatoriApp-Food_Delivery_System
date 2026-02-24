import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const SplashScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-white dark:bg-gray-950 flex flex-col items-center justify-center"
        >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative flex flex-col items-center gap-8">
                {/* Logo with pulse and flip effect */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: 1
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "anticipate",
                        scale: {
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }
                    }}
                    className="relative"
                >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center p-6 border border-gray-100 dark:border-gray-800">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    {/* Ripple effect */}
                    <motion.div
                        animate={{
                            scale: [1, 1.5],
                            opacity: [0.5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                        className="absolute inset-0 bg-orange-500/20 rounded-[2.5rem] -z-10"
                    />
                </motion.div>

                {/* Brand Name */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                        Chatori<span className="text-orange-500">App</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
                        Fast Food • Faster Delivery
                    </p>
                </motion.div>

                {/* Loading Bar */}
                <div className="w-48 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-4">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;
