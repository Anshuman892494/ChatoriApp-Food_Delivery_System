import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StaticPage = ({ title }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-950 px-4 pb-20 relative overflow-hidden flex flex-col items-center">
            {/* Decorative background orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -ml-48 -mb-48"></div>

            <div className="max-w-4xl w-full relative z-10">
                <header className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold text-xs uppercase tracking-widest transition-colors mb-8 group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight sm:leading-none"
                    >
                        {title.split(' ').map((word, i) => (
                            <span key={i} className="">
                                {i === 0 ? (
                                    <span className="text-orange-500 underline decoration-orange-200 dark:decoration-orange-900/50 decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8 mr-2 sm:mr-4">
                                        {word}
                                    </span>
                                ) : (
                                    <span>{word}{' '}</span>
                                )}
                            </span>
                        ))}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 dark:text-gray-400 font-bold tracking-wide mt-6 uppercase text-xs"
                    >
                        Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </motion.p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
                >
                    <div className="prose dark:prose-invert max-w-none space-y-8 font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Introduction</h2>
                            <p>
                                Welcome to the {title} page of ChatoriApp. We are committed to providing the best food delivery experience while maintaining transparency and trust with our royal users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Section Title</h2>
                            <p>
                                This is a placeholder for the detailed content of the {title}. In a real-world application, this section would contain legal jargon, company history, or specific guidelines relevant to the page topic.
                            </p>
                            <p>
                                ChatoriApp prides itself on its "Royal Feast" philosophy, ensuring every order is treated with the utmost care and delivered with speed that exceeds expectations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Our Commitment</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Premium Service Quality</li>
                                <li>Transparency in Operations</li>
                                <li>User-Centric Design</li>
                                <li>Swift and Safe Delivery</li>
                            </ul>
                        </section>

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed">
                                Questions about this page? <br />
                                <span className="text-orange-500 cursor-pointer hover:underline">Contact Legal Support</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StaticPage;
