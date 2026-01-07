import React, { useState, useEffect } from 'react';
import {
    ChartTrendingUpIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    PuzzlePieceIcon,
    Squares2X2Icon,
    UsersIcon,
    Bars3Icon,
    XMarkIcon,
    InstagramIcon,
    TikTokIcon,
    TwitterIcon,
    LinkedInIcon,
    FacebookIcon,
    YouTubeIcon,
    PinterestIcon,
    CpuChipIcon,
    PlusIcon
} from './icons.tsx';
import { useData } from './DataContext.tsx';
import ClientSuccessStories from './ClientSuccessStories.tsx';
import PremiumButton from './PremiumButton.tsx';
import HowItWorks from './HowItWorks.tsx';
import HeroDashboard from './HeroDashboard.tsx';
import ProblemsWeSolve from './ProblemsWeSolve.tsx';

const Logo: React.FC<{ iconOnly?: boolean; className?: string }> = ({ iconOnly = false, className }) => (
    <div className={`flex items-center group cursor-pointer select-none flex-shrink-0 ${className || ''}`}>
        <svg 
            viewBox="0 0 340 100" 
            className={`${iconOnly ? 'w-10 h-10' : 'h-10 sm:h-11 md:h-10 lg:h-12 w-auto'} transition-transform duration-500 group-hover:scale-105`} 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="logoSilverGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="75%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
            </defs>
            {!iconOnly && (
                <>
                    {/* "One" Text - White on Mobile, Silver Gradient on Desktop */}
                    <text x="10" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#logoSilverGradient)]" style={{ letterSpacing: '-3px' }}>One</text>
                    
                    {/* "Lek" Text - White on Mobile, Silver Gradient on Desktop */}
                    <text x="210" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#logoSilverGradient)]" style={{ letterSpacing: '-3px' }}>Lek</text>
                </>
            )}

            {/* "Q" Stylized Icon - Blue Theme */}
            <g transform={iconOnly ? "translate(170, 50) scale(1.3)" : "translate(165, 55)"}>
                <circle r="42" fill="#1E40AF" />
                <circle r="36" fill="#080C18" />
                <path d="M0 0 L0 -36 A36 36 0 1 0 36 0 Z" fill="#111827" />
                <path d="M0 0 L36 0 A36 36 0 0 0 0 -36 Z" fill="#3B82F6" />
                <line x1="0" y1="0" x2="0" y2="-36" stroke="#080C18" strokeWidth="2" />
                <line x1="0" y1="0" x2="36" y2="0" stroke="#080C18" strokeWidth="2" />
                <path 
                    d="M28 28 L48 48" 
                    stroke="#3B82F6" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                />
            </g>
        </svg>
    </div>
);

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, callback?: () => void) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    if (callback) {
        callback();
    }
};

const Header: React.FC<{ onNavigate: (page: 'login' | null) => void }> = ({ onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#how-it-works', label: 'How it Works' },
        { href: '#problems', label: 'Problems Solved' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#stories', label: 'Stories' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contact', label: 'Contact' },
    ];
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <div className="flex items-center space-x-4 md:space-x-8 overflow-hidden min-w-0">
                        <Logo />
                        <nav className="hidden md:flex space-x-8">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e)} className="text-secondary-text hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <button onClick={() => onNavigate('login')} className="text-secondary-text font-semibold px-4 py-2 rounded-full hover:bg-white/10 transition-colors hidden md:block">
                            Sign In
                        </button>
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-secondary-text hover:text-white">
                                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Silver Bottom Border - Increased thickness to 2px */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-400/40 via-white/50 via-slate-400/40 to-transparent shadow-[0_1px_4px_rgba(255,255,255,0.1)]"></div>
            
            {/* Mobile Menu */}
            <div className={`absolute top-16 left-0 w-full bg-black/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className="px-4 py-6 space-y-4 shadow-2xl">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e, closeMobileMenu)} className="block text-center text-secondary-text hover:text-white transition-colors py-2 rounded-md font-medium">
                            {link.label}
                        </a>
                    ))}
                    <div className="border-t border-border-color pt-4">
                        <button onClick={() => { onNavigate('login'); closeMobileMenu(); }} className="w-full text-center text-white font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-card-bg border border-border-color p-6 rounded-2xl transition-all duration-300 hover:border-accent-blue/50 hover:-translate-y-1">
        <div className="bg-accent-blue/10 text-accent-blue p-3 rounded-lg inline-block mb-4">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-secondary-text text-sm">{children}</p>
    </div>
);

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-color py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left"
            >
                <h4 className="font-semibold text-lg text-white">{question}</h4>
                <ChevronDownIcon className={`w-6 h-6 text-secondary-text transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="text-secondary-text leading-relaxed">{children}</p>
                </div>
            </div>
        </div>
    );
};

const SocialButton: React.FC<{ icon: React.ElementType; href: string; label: string; colorClass: string }> = ({ icon: Icon, href, label, colorClass }) => (
    <a 
        href={href} 
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative p-3 flex items-center justify-center transition-all duration-300 ease-in-out"
    >
        {/* Hover Glow Background */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300 bg-current ${colorClass} blur-md`}></div>
        
        {/* Icon */}
        <Icon className={`w-5 h-5 text-neutral-400 transition-all duration-300 group-hover:scale-110 group-hover:text-white z-10`} />
    </a>
);

const LandingPage: React.FC<{ onNavigate: (page: 'login' | null) => void }> = ({ onNavigate }) => {
    const { handleSaveContactMessage } = useData();
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContactForm(prev => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveContactMessage(contactForm);
        
        setIsFormSubmitted(true);
        setContactForm({ name: '', email: '', message: '' });

        setTimeout(() => {
            setIsFormSubmitted(false);
        }, 5000);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sectionBackgroundClass = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black";

    return (
        <div className="bg-black text-primary-text scroll-smooth">
            <Header onNavigate={onNavigate} />

            <main>
                {/* Hero Section */}
                <section id="home" className="relative pt-32 pb-20 text-center overflow-hidden">
                    {/* Background Patterns */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    
                    {/* Premium Spotlight Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10 select-none overflow-hidden">
                        {/* Core Beam Line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[400px] bg-gradient-to-b from-blue-400/60 via-blue-400/20 to-transparent"></div>
                        
                        {/* Primary High-Intensity Glow */}
                        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-blue-500/20 rounded-[100%] blur-[60px]"></div>
                        
                        {/* Broad Ambience Glow */}
                        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 rounded-[100%] blur-[120px] opacity-70"></div>
                        
                        {/* Center Point Flare */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_20px_4px_rgba(59,130,246,0.8)]"></div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Turn Your Data Into Clear, Actionable Stories
                        </h1>
                        <div className="mt-6 text-lg text-secondary-text max-w-3xl mx-auto leading-relaxed space-y-6">
                            <p>
                                Upload your data, Our AI-enhanced engine reads it and generates a fully interactive dashboard based on a pre-trained logic model that we build specifically for your business.
                            </p>
                        </div>
                    </div>
                    
                    {/* Updated Interactive Hero Dashboard */}
                    <div className="mt-16 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="bg-gradient-to-b from-gray-900 to-black p-2 rounded-3xl shadow-2xl shadow-blue-900/20">
                            <HeroDashboard />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-center space-x-4 relative z-10">
                        <PremiumButton onClick={() => onNavigate('login')}>
                            Get Started
                        </PremiumButton>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works">
                    <HowItWorks />
                </section>

                {/* Problems We Solve Section */}
                <section id="problems">
                    <ProblemsWeSolve />
                </section>
                
                {/* Pricing Section */}
                <section id="pricing" className={`py-24 ${sectionBackgroundClass} relative overflow-hidden`}>
                    {/* Background elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl md:text-5xl tracking-tight mb-4 font-playfair font-medium text-gray-100">
                                Transparent <span className="font-playfair font-medium text-blue-400">Pricing Strategy</span>
                            </h2>
                            <p className="mt-6 text-lg text-secondary-text font-geist">
                                We believe in a fair model. You pay for the initial build once, and an annual subscription that scales only with the value you derive.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* One-Time Cost Card */}
                            <div className="lg:col-span-4 bg-card-bg/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-300">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                                        The Foundation
                                    </span>
                                    <h3 className="text-2xl font-bold text-white mb-2">One-Time Development</h3>
                                    <p className="text-3xl font-light text-white/80 mb-6">Build & Train</p>
                                    <p className="text-secondary-text mb-8 leading-relaxed">
                                        We analyze your data structure, build the custom logic, and train our AI agents to understand your specific business context. This is a single, upfront investment.
                                    </p>
                                    <ul className="space-y-3 mt-auto">
                                        {['Custom Logic Building', 'AI Model Training', 'Data Architecture Setup', 'Security Implementation'].map((item, i) => (
                                            <li key={i} className="flex items-center text-sm text-gray-300">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 mr-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Plus Sign (Visual) */}
                            <div className="lg:col-span-1 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                                    <PlusIcon className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Annual Subscription Container */}
                            <div className="lg:col-span-7 flex flex-col">
                                <div className="bg-gradient-to-br from-purple-900/20 to-black border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Squares2X2Icon className="w-32 h-32 text-purple-500" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
                                            <div>
                                                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                                                    Recurring Value
                                                </span>
                                                <h3 className="text-2xl font-bold text-white">Annual Subscription</h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-secondary-text">Covers maintenance, hosting & updates</p>
                                            </div>
                                        </div>

                                        <p className="text-secondary-text mb-8">
                                            Your annual fee is calculated based on four key usage factors, ensuring you only pay for the scale and complexity you need.
                                        </p>

                                        {/* Interactive Factors Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Factor 1: Dashboards */}
                                            <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-xl p-5 transition-all duration-300 group cursor-default">
                                                <div className="flex items-center mb-3">
                                                    <Squares2X2Icon className="w-6 h-6 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                                                    <h4 className="font-bold text-white">Dashboards</h4>
                                                </div>
                                                <p className="text-sm text-gray-400">Volume of distinct dashboard views deployed.</p>
                                            </div>

                                            {/* Factor 2: Add-ins */}
                                            <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-500/30 rounded-xl p-5 transition-all duration-300 group cursor-default">
                                                <div className="flex items-center mb-3">
                                                    <PuzzlePieceIcon className="w-6 h-6 text-pink-400 mr-3 group-hover:scale-110 transition-transform" />
                                                    <h4 className="font-bold text-white">Add-ins</h4>
                                                </div>
                                                <p className="text-sm text-gray-400">Small creative tools helping in day-to-day tasks.</p>
                                            </div>

                                            {/* Factor 3: Complexity */}
                                            <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 rounded-xl p-5 transition-all duration-300 group cursor-default">
                                                <div className="flex items-center mb-3">
                                                    <CpuChipIcon className="w-6 h-6 text-amber-400 mr-3 group-hover:scale-110 transition-transform" />
                                                    <h4 className="font-bold text-white">Logic Complexity</h4>
                                                </div>
                                                <p className="text-sm text-gray-400">Depth of calculations and data relationships.</p>
                                            </div>

                                            {/* Factor 4: Users */}
                                            <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-500/30 rounded-xl p-5 transition-all duration-300 group cursor-default">
                                                <div className="flex items-center mb-3">
                                                    <UsersIcon className="w-6 h-6 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                                                    <h4 className="font-bold text-white">Users</h4>
                                                </div>
                                                <p className="text-sm text-gray-400">Number of team members requiring access.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <PremiumButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Request a Quote
                            </PremiumButton>
                            <p className="mt-4 text-sm text-secondary-text">
                                Since every business is unique, we provide custom quotes based on your specific data needs.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Client Success Stories */}
                <section id="stories">
                    <ClientSuccessStories />
                </section>

                {/* FAQ Section */}
                <section id="faq" className={`py-20 ${sectionBackgroundClass}`}>
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Frequently Asked Questions</h2>
                        </div>
                        <div className="mt-10">
                            <FaqItem question="Do I need to know Power BI, DAX, or coding?">
                                Zero. Our platform is built for business users, not data engineers. You upload your spreadsheet, and our AI engine builds the logic, relationships, and visuals for you.
                            </FaqItem>
                            <FaqItem question="How does the AI handle my specific business logic?">
                                During the one-time setup, we train our AI agents on your specific data structure and business rules. This creates a "Dashboard Blueprint" that ensures every future upload is processed exactly how you need it.
                            </FaqItem>
                            <FaqItem question="What happens if I upload a file with mistakes?">
                                Our AI Validator scans every file before processing. If a column is missing or a date format is wrong, the system blocks the upload and tells you exactly what to fix in plain English.
                            </FaqItem>
                            <FaqItem question="Is my data secure?">
                                Yes. We use bank-grade encryption (AES-256) for storage and transmission. Your data models are isolated in secure containers, ensuring total privacy and compliance.
                            </FaqItem>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className={`py-20 border-t border-white/5 ${sectionBackgroundClass}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Get in Touch</h2>
                            <p className="mt-4 text-lg text-secondary-text">Have questions? We'd love to hear from you.</p>
                        </div>
                        <div className="mt-12 max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                {/* Form Card */}
                                <div className="bg-card-bg border border-border-color rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
                                    {isFormSubmitted ? (
                                        <div className="flex items-center space-x-3 bg-green-500/10 text-green-300 p-4 rounded-lg">
                                            <CheckCircleIcon className="w-6 h-6" />
                                            <p>Thank you! Your message has been sent successfully.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleContactSubmit} className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-secondary-text mb-2">Your Name</label>
                                                <input type="text" id="name" name="name" value={contactForm.name} onChange={handleContactChange} required className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none" />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-secondary-text mb-2">Your Email</label>
                                                <input type="email" id="email" name="email" value={contactForm.email} onChange={handleContactChange} required className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none" />
                                            </div>
                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-secondary-text mb-2">Message</label>
                                                <textarea id="message" name="message" rows={4} value={contactForm.message} onChange={handleContactChange} required className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"></textarea>
                                            </div>
                                            <PremiumButton type="submit" className="w-full">
                                                Send Message
                                            </PremiumButton>
                                        </form>
                                    )}
                                </div>
                                 {/* Map */}
                                <div className="overflow-hidden rounded-2xl border border-border-color h-full min-h-[450px]">
                                    <iframe
                                        src="https://maps.google.com/maps?q=dubai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '100%' }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="grayscale invert-[1] hue-rotate-[180deg]"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Modern Floating Bar (Enhanced for Responsiveness) */}
            <footer className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-full px-6 py-8 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
                        
                        {/* Copyright */}
                        <div className="flex items-center text-center sm:text-left order-2 sm:order-1 sm:pl-4">
                            <span className="text-sm text-neutral-400 font-medium">© {new Date().getFullYear()} OneQlek. All rights reserved.</span>
                        </div>

                        {/* Social Icons Bar */}
                        <div className="flex flex-wrap justify-center items-center gap-1 order-1 sm:order-2">
                           <SocialButton href="https://x.com/oneqlek?s=21" icon={TwitterIcon} label="X (Twitter)" colorClass="text-sky-500" />
                           <SocialButton href="https://www.facebook.com/share/1Bx4hQQJq6/?mibextid=wwXIfr" icon={FacebookIcon} label="Facebook" colorClass="text-blue-600" />
                           <SocialButton href="https://www.instagram.com/oneqlek?igsh=ZzAxNDl1bHNhdmN1&utm_source=qr" icon={InstagramIcon} label="Instagram" colorClass="text-pink-500" />
                           <SocialButton href="https://www.tiktok.com/@trendsnsale?_r=1&_t=ZS-92lHSa62n49" icon={TikTokIcon} label="TikTok" colorClass="text-teal-400" />
                           <SocialButton href="https://youtube.com/@oneqlek?si=L3XKZIXs2c79dlOx" icon={YouTubeIcon} label="YouTube" colorClass="text-red-600" />
                           <SocialButton href="https://www.linkedin.com/company/businessnextstep/" icon={LinkedInIcon} label="LinkedIn" colorClass="text-blue-700" />
                           <SocialButton href="https://pin.it/3X2fMpJ7w" icon={PinterestIcon} label="Pinterest" colorClass="text-red-500" />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modern Floating Scroll Up Arrow */}
            <button 
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-0 transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 ${
                    showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                }`}
            >
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl flex items-center justify-center group hover:border-blue-500/50 transition-all">
                    <ChevronUpIcon className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-white transition-colors" />
                </div>
            </button>
        </div>
    );
};

export default LandingPage;