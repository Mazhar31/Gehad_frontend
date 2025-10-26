


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
    CpuChipIcon,
    SignalIcon,
    ShieldCheckIcon,
    Bars3Icon,
    XMarkIcon
} from './icons.tsx';
import { useData } from './DataContext.tsx';

const Logo: React.FC = () => (
    <div className="flex items-center space-x-2">
         <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 7L12 12M12 22V12M22 7L12 12M16 4.5L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span className="font-bold text-xl tracking-tighter">Projex</span>
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
        { href: '#features', label: 'Features' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contact', label: 'Contact' },
    ];
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-8">
                        <Logo />
                        <nav className="hidden md:flex space-x-8">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e)} className="text-secondary-text hover:text-white transition-colors">
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
            <div className={`absolute top-20 left-0 w-full bg-dark-bg/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
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
        quote: 'Projectile has completely transformed how we manage our client projects. The dashboard gives us a crystal-clear overview, and our clients love the transparency. Highly recommended!',
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
        quote: 'As a design agency, presentation is everything. Projectile not only helps us stay organized internally but also impresses our clients with its professional and sleek interface.',
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
                    <p className="text-secondary-text">{children}</p>
                </div>
            </div>
        </div>
    );
};

const integrations = [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'GitLab', icon: GitLabIcon },
    { name: 'Slack', icon: SlackIcon },
    { name: 'Trello', icon: TrelloIcon },
    { name: 'Discord', icon: DiscordIcon },
    { name: 'Reddit', icon: RedditIcon },
];

const LandingPage: React.FC<{ onNavigate: (page: 'login' | null) => void }> = ({ onNavigate }) => {
    const { handleSaveContactMessage } = useData();
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

    return (
        <div className="bg-dark-bg text-primary-text scroll-smooth">
            <Header onNavigate={onNavigate} />

            <main>
                {/* Hero Section */}
                <section id="home" className="relative pt-32 pb-20 text-center overflow-hidden">
                     <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                     <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-900/20 to-transparent blur-3xl"></div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            The Ultimate Dashboard for Your Projects
                        </h1>
                        <p className="mt-6 text-lg text-secondary-text max-w-2xl mx-auto">
                            Manage all your projects in one place with Projectile. View plans, track progress, increase productivity and improve communication.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4">
                            <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg">
                                Get Started
                            </button>
                        </div>
                    </div>
                    <div className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="bg-gradient-to-b from-sidebar-bg to-dark-bg p-2 rounded-3xl shadow-2xl shadow-blue-900/20">
                            <img 
                                src="https://storage.cloud.google.com/ai-studio-bucket-1089004137383-us-west1/IMG_3464.JPG"
                                alt="Projectile App Dashboard" 
                                className="rounded-2xl border border-border-color" 
                            />
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Why Choose Projectile?</h2>
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
                        <p className="text-secondary-text mb-8">Projectile works seamlessly with the tools you already use, making your workflow smoother.</p>
                        <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4">
                            {integrations.map(tool => (
                                <tool.icon key={tool.name} className="w-8 h-8 text-secondary-text hover:text-white transition-colors" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-extrabold tracking-tighter text-white">A Pricing Structure That Scales With You</h2>
                        <p className="mt-4 text-lg text-secondary-text">Our pricing is simple and transparent. You only pay for what you need. No hidden fees, ever.</p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                           <div className="bg-card-bg border border-border-color rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="bg-accent-blue/10 text-accent-blue p-4 rounded-full mb-4">
                                    <Squares2X2Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">User Dashboard</h3>
                                <p className="text-secondary-text text-sm">The price is tailored to the number of user dashboards you need to deploy.</p>
                           </div>
                           <div className="bg-card-bg border border-border-color rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="bg-accent-green/10 text-accent-green p-4 rounded-full mb-4">
                                    <UsersIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Users</h3>
                                <p className="text-secondary-text text-sm">Pricing adjusts based on the total number of unique users who require access.</p>
                           </div>
                           <div className="bg-card-bg border border-border-color rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="bg-accent-pink/10 text-accent-pink p-4 rounded-full mb-4">
                                    <PuzzlePieceIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Add-ins</h3>
                                <p className="text-secondary-text text-sm">Enhance your experience with powerful add-ins, priced individually for flexibility.</p>
                           </div>
                        </div>
                        <div className="mt-12">
                            <button className="bg-accent-lime text-black font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity text-lg">
                                Call Us Now
                            </button>
                        </div>
                    </div>
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
                <section id="faq" className="py-20">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Frequently Asked Questions</h2>
                        </div>
                        <div className="mt-10">
                            <FaqItem question="Can I customize the client dashboards?">
                                Absolutely! While the core layout is standardized for ease of use, you can customize branding, upload logos, and decide which data points and reports are visible to each client.
                            </FaqItem>
                            <FaqItem question="How does the 'user' pricing work?">
                                You are billed based on the total number of unique users (both your team members and client-side users) who have active accounts on the platform during a billing cycle.
                            </FaqItem>
                            <FaqItem question="Is my data secure?">
                                Yes, security is our top priority. All data is encrypted in transit and at rest. We use industry-standard security practices to ensure your and your clients' data is always protected.
                            </FaqItem>
                             <FaqItem question="What kind of support do you offer?">
                                We offer comprehensive support through email and a dedicated support portal. Our team is always ready to help you with any questions or issues you might have.
                            </FaqItem>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-sidebar-bg/50">
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
                                            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                                Send Message
                                            </button>
                                        </form>
                                    )}
                                </div>
                                 {/* Map */}
                                <div className="overflow-hidden rounded-2xl border border-border-color h-full">
                                    <iframe
                                        src="https://maps.google.com/maps?q=dubai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '450px' }}
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
                                                <p className="text-secondary-text">contact@projex.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-dark-bg border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Logo/>
                        </div>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                           <a href="#features" onClick={(e) => handleSmoothScroll(e)} className="text-secondary-text hover:text-white transition-colors">Features</a>
                           <a href="#pricing" onClick={(e) => handleSmoothScroll(e)} className="text-secondary-text hover:text-white transition-colors">Pricing</a>
                           <a href="#contact" onClick={(e) => handleSmoothScroll(e)} className="text-secondary-text hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-border-color pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-secondary-text">
                        <p>&copy; {new Date().getFullYear()} Projex Inc. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 sm:mt-0">
                           <a href="#" className="hover:text-white">Privacy Policy</a>
                           <a href="#" className="hover:text-white">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;