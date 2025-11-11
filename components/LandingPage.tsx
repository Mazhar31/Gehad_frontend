import React, { useState } from 'react';
import {
    ChartTrendingUpIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    DiscordIcon,
    EnvelopeIcon,
    GitHubIcon,
    GitLabIcon,
    MapPinIcon,
    PhoneIcon,
    PuzzlePieceIcon,
    RedditIcon,
    SlackIcon,
    Squares2X2Icon,
    StarIcon,
    TrelloIcon,
    UsersIcon,
    Bars3Icon,
    XMarkIcon,
    InstagramIcon,
    TikTokIcon,
    TwitterIcon,
    LinkedInIcon,
    FacebookIcon,
    CpuChipIcon,
    SignalIcon,
    ShieldCheckIcon,
    ArrowTopRightOnSquareIcon,
    PlusIcon
} from './icons.tsx';
import { useData } from './DataContext.tsx';
import ClientSuccessStories from './ClientSuccessStories.tsx';
import PremiumButton from './PremiumButton.tsx';
import HowItWorks from './HowItWorks.tsx';
import HeroDashboard from './HeroDashboard.tsx';
import ProblemsWeSolve from './ProblemsWeSolve.tsx';

const Logo: React.FC = () => (
    <div className="flex items-center space-x-2">
         <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 7L12 12M12 22V12M22 7L12 12M16 4.5L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span className="font-bold text-xl tracking-tighter">OneQlek</span>
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
        { href: '#features', label: 'Features' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#stories', label: 'Stories' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contact', label: 'Contact' },
    ];
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-8">
                        <Logo />
                        <nav className="hidden md:flex space-x-8">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e)} className="text-secondary-text hover:text-white transition-colors text-sm font-medium">
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
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
            
            {/* Mobile Menu */}
            <div className={`absolute top-20 left-0 w-full bg-black/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className="px-4 py-6 space-y-4">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e, closeMobileMenu)} className="block text-center text-secondary-text hover:text-white transition-colors py-2 rounded-md">
                            {link.label}
                        </a>
                    ))}
                    <div className="border-t border-border-color pt-4">
                        <button onClick={() => { onNavigate('login'); closeMobileMenu(); }} className="w-full text-center text-white font-semibold px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors">
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

const TestimonialCard: React.FC<{ testimonial: any }> = ({ testimonial }) => (
    <div className="bg-card-bg p-6 rounded-2xl border border-border-color text-left h-full flex flex-col">
        <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
            ))}
        </div>
        <blockquote className="text-secondary-text italic mb-4 flex-grow">"{testimonial.quote}"</blockquote>
        <div className="flex items-center">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
            <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-secondary-text">{testimonial.company}</p>
            </div>
        </div>
    </div>
);

const testimonials = [
    {
        name: 'Sarah K.',
        company: 'Innovate Inc.',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        rating: 5,
        quote: 'OneQlek has completely transformed how we manage our client projects. The dashboard gives us a crystal-clear overview, and our clients love the transparency. Highly recommended!',
    },
    {
        name: 'Michael B.',
        company: 'Solutions Co.',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        rating: 5,
        quote: "The ability to give our clients their own dashboard access is a game-changer. It's reduced our email back-and-forth by at least 50%. The platform is intuitive and powerful.",
    },
    {
        name: 'Jessica L.',
        company: 'Creative Minds',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        rating: 5,
        quote: 'As a design agency, presentation is everything. OneQlek not only helps us stay organized internally but also impresses our clients with its professional and sleek interface.',
    },
];


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
        className="group relative p-3 flex items-center justify-center transition-all duration-300 ease-in-out"
    >
        {/* Hover Glow Background */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300 bg-current ${colorClass} blur-md`}></div>
        
        {/* Icon */}
        <Icon className={`w-5 h-5 text-neutral-400 transition-all duration-300 group-hover:scale-110 group-hover:text-white z-10`} />
    </a>
);

const integrations = [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'GitLab', icon: GitLabIcon },
    { name: 'Slack', icon: SlackIcon },
    { name: 'Trello', icon: TrelloIcon },
    { name: 'Discord', icon: DiscordIcon },
    { name: 'Reddit', icon: RedditIcon },
];

const LandingPage: React.FC<{ onNavigate: (page: 'login' | null) => void }> = ({ onNavigate }) => {
    const { handleSaveContactMessage, portfolioCases } = useData();
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContactForm(prev => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // This now calls the central handler to store the message and simulate the email.
        handleSaveContactMessage(contactForm);
        
        setIsFormSubmitted(true);
        setContactForm({ name: '', email: '', message: '' });

        // Hide the success message after a few seconds
        setTimeout(() => {
            setIsFormSubmitted(false);
        }, 5000);
    };

    const sectionBackgroundClass = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black";

    return (
        <div className="bg-black text-primary-text scroll-smooth">
            <Header onNavigate={onNavigate} />

            <main>
                {/* Hero Section */}
                <section id="home" className="relative pt-32 pb-20 text-center overflow-hidden">
                     <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                     <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-900/20 to-transparent blur-3xl"></div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Turn Your Data Into an AI-Powered Dashboard
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
                
                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Why Choose OneQlek?</h2>
                            <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                                Everything you need to streamline your workflow and keep your clients happy.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard icon={Squares2X2Icon} title="Client Dashboards">
                                Impress your clients with a dedicated, professional dashboard to track their project's progress in real-time.
                            </FeatureCard>
                            <FeatureCard icon={ChartTrendingUpIcon} title="Progress Tracking">
                                Visualize project milestones, budgets, and timelines with intuitive charts and progress bars.
                            </FeatureCard>
                             <FeatureCard icon={UsersIcon} title="User Management">
                                Assign specific users from your client's team to projects, controlling their access and permissions.
                            </FeatureCard>
                        </div>
                    </div>
                </section>
                
                {/* Integrations Section */}
                <section className="py-20 bg-sidebar-bg/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Integrates with Your Favorite Tools</h2>
                        <p className="text-secondary-text mb-8">OneQlek works seamlessly with the tools you already use, making your workflow smoother.</p>
                        <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4">
                            {integrations.map(tool => (
                                <tool.icon key={tool.name} className="w-8 h-8 text-secondary-text hover:text-white transition-colors" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portfolio Section */}
                <section id="portfolio" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Our Work in Action</h2>
                            <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                                We deliver high-quality solutions that solve real-world problems and drive business growth.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioCases.map((caseItem, index) => (
                                <div key={index} className="bg-card-bg rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 border border-border-color">
                                    <div className="aspect-video overflow-hidden">
                                        <img src={caseItem.imageUrl} alt={caseItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm font-medium text-accent-blue mb-2">{caseItem.category}</p>
                                        <h3 className="text-xl font-bold text-white mb-3">{caseItem.title}</h3>
                                        <p className="text-secondary-text text-sm mb-6 h-20">
                                            {caseItem.description}
                                        </p>
                                        <a href={caseItem.link} className="inline-flex items-center font-semibold text-white group-hover:text-accent-blue transition-colors">
                                            View Case Study
                                            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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

                {/* Testimonials */}
                <section className="py-20 bg-dark-bg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Loved by Teams Everywhere</h2>
                            <p className="mt-4 text-lg text-secondary-text">Don't just take our word for it. Here's what our customers are saying.</p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <TestimonialCard key={i} testimonial={t} />
                            ))}
                        </div>
                    </div>
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
                            <FaqItem question="Can I customize the client dashboards?">
                                Absolutely! While the core layout is standardized for ease of use, you can customize branding, upload logos, and decide which data points and reports are visible to each client.
                            </FaqItem>
                            <FaqItem question="What happens if I upload a file with mistakes?">
                                Our AI Validator scans every file before processing. If a column is missing or a date format is wrong, the system blocks the upload and tells you exactly what to fix in plain English.
                            </FaqItem>
                            <FaqItem question="How does the 'user' pricing work?">
                                You are billed based on the total number of unique users (both your team members and client-side users) who have active accounts on the platform during a billing cycle.
                            </FaqItem>
                            <FaqItem question="Is my data secure?">
                                Yes. We use bank-grade encryption (AES-256) for storage and transmission. Your data models are isolated in secure containers, ensuring total privacy and compliance.
                            </FaqItem>
                            <FaqItem question="What kind of support do you offer?">
                                We offer comprehensive support through email and a dedicated support portal. Our team is always ready to help you with any questions or issues you might have.
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

                            {/* Contact Info Card - Below */}
                            <div className="mt-12">
                                <div className="bg-card-bg border border-border-color rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-dark-bg p-2 rounded-lg text-accent-blue flex-shrink-0">
                                                <MapPinIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">Our Office</h4>
                                                <p className="text-secondary-text">
                                                    123 Innovation Drive, Suite 456<br />
                                                    Tech City, TX 75001, USA
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-dark-bg p-2 rounded-lg text-accent-blue flex-shrink-0">
                                                <PhoneIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">Phone</h4>
                                                <p className="text-secondary-text">(555) 123-4567</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-dark-bg p-2 rounded-lg text-accent-blue flex-shrink-0">
                                                <EnvelopeIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">Email</h4>
                                                <p className="text-secondary-text">contact@oneqlek.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Modern Floating Bar */}
            <footer className="relative py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-full px-2 py-2 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
                        
                        {/* Logo & Copyright */}
                        <div className="flex items-center gap-4 pl-6">
                             <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                <path d="M2 7L12 12M12 22V12M22 7L12 12M16 4.5L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm text-neutral-400 font-medium">© {new Date().getFullYear()} OneQlek</span>
                        </div>

                        {/* Social Icons Bar */}
                        <div className="flex items-center gap-1 pr-2">
                           <SocialButton href="#" icon={TwitterIcon} label="Twitter" colorClass="text-sky-500" />
                           <SocialButton href="#" icon={FacebookIcon} label="Facebook" colorClass="text-blue-600" />
                           <SocialButton href="#" icon={InstagramIcon} label="Instagram" colorClass="text-pink-500" />
                           <SocialButton href="#" icon={TikTokIcon} label="TikTok" colorClass="text-teal-400" />
                           <SocialButton href="#" icon={LinkedInIcon} label="LinkedIn" colorClass="text-blue-700" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
