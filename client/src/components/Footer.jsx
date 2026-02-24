import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
    FiInstagram, FiTwitter, FiFacebook, FiYoutube,
    FiMapPin, FiPhone, FiMail, FiHeart
} from 'react-icons/fi';

const Footer = () => {
    const year = new Date().getFullYear();

    const socialLinks = [
        { icon: <FiInstagram />, label: 'Instagram', path: '#' },
        { icon: <FiFacebook />, label: 'Facebook', path: '#' },
        { icon: <FiYoutube />, label: 'YouTube', path: '#' },
    ];
    const companyLinks = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Blog', path: '/blog' },
        { label: 'Partner with us', path: '/partner' }
    ];
    const legalLinks = [
        { label: 'Terms & Conditions', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Cookie Policy', path: '/cookie-policy' },
        { label: 'Refund Policy', path: '/refund-policy' }
    ];

    return (
        <footer className="relative bg-gray-900 overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>

            <div className="text-gray-400 px-6 pt-12 sm:pt-20 pb-0 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8 pb-16 border-b border-white/5">

                    {/* Brand Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-4 pr-0 lg:pr-12 text-center sm:text-left">
                        <Link to="/" className="flex items-center justify-center sm:justify-start gap-2.5 mb-6 group">
                            <img src={logo} alt="Logo" className="w-8 h-8 object-contain hover:scale-110 transition-transform duration-300" />
                            <span className="text-2xl font-extrabold text-white tracking-tight">
                                Chatori<span className="text-orange-500">App</span>
                            </span>
                        </Link>
                        <p className="text-[15px] leading-relaxed mb-8 text-gray-400 font-medium max-w-md mx-auto sm:mx-0">
                            Swift delivery, trusted service. Experience the best food from top restaurants, delivered fresh to your door with a single click.
                        </p>
                        <div className="flex justify-center sm:justify-start gap-3">
                            {socialLinks.map(s => (
                                <a key={s.label} href={s.path} aria-label={s.label}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg">
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="col-span-1 lg:col-span-2 text-center sm:text-left">
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.15em] text-white mb-7">Company</h4>
                        <ul className="space-y-4">
                            {companyLinks.map(l => (
                                <li key={l.label}>
                                    <Link to={l.path} className="text-[14px] font-medium text-gray-400 hover:text-orange-400 hover:translate-x-1 transition-all inline-block">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="col-span-1 lg:col-span-2 text-center sm:text-left">
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.15em] text-white mb-7">Legal</h4>
                        <ul className="space-y-4">
                            {legalLinks.map(l => (
                                <li key={l.label}>
                                    <Link to={l.path} className="text-[14px] font-medium text-gray-400 hover:text-orange-400 hover:translate-x-1 transition-all inline-block">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-4 lg:pl-8">
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.15em] text-white mb-7 text-center sm:text-left">Get in Touch</h4>
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-5">
                            <a href="https://maps.google.com/?q=Lovely+Professional+University" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group/contact hover:bg-white/[0.02] -m-2 p-2 rounded-xl transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 group-hover/contact:bg-orange-500 group-hover/contact:text-white transition-all">
                                    <FiMapPin size={16} />
                                </div>
                                <span className="text-[14px] font-medium leading-normal pt-1 text-gray-400 group-hover/contact:text-white transition-colors">Lovely Professional University</span>
                            </a>
                            <a href="tel:+919876543210" className="flex items-start gap-4 group/contact hover:bg-white/[0.02] -m-2 p-2 rounded-xl transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 group-hover/contact:bg-orange-500 group-hover/contact:text-white transition-all">
                                    <FiPhone size={16} />
                                </div>
                                <span className="text-[14px] font-medium leading-normal pt-1 text-gray-400 group-hover/contact:text-white transition-colors">+91 98765 43210</span>
                            </a>
                            <a href="mailto:hello@chatoriapp.com" className="flex items-start gap-4 group/contact hover:bg-white/[0.02] -m-2 p-2 rounded-xl transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 group-hover/contact:bg-orange-500 group-hover/contact:text-white transition-all">
                                    <FiMail size={16} />
                                </div>
                                <span className="text-[14px] font-medium leading-normal pt-1 break-all text-gray-400 group-hover/contact:text-white transition-colors">hello@chatoriapp.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="max-w-7xl mx-auto py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[13px] font-semibold text-gray-500 tracking-wide text-center sm:text-left">
                    <p>© {year} <strong className="text-white hover:text-orange-500 transition-colors cursor-pointer">ChatoriApp</strong>. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
