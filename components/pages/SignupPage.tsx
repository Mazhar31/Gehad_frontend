import React, { useEffect } from 'react';

const Logo: React.FC<{ iconOnly?: boolean }> = ({ iconOnly = false }) => (
    <div className="flex items-center justify-center group cursor-pointer select-none flex-shrink-0">
        <svg 
            viewBox="0 0 340 100" 
            className={`${iconOnly ? 'w-10 h-10' : 'h-10 sm:h-11 md:h-10 w-auto'} transition-transform duration-500 group-hover:scale-105`} 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="signupSilverGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="75%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
            </defs>
            {!iconOnly && (
                <>
                    <text x="10" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#signupSilverGradient)]" style={{ letterSpacing: '-3px' }}>One</text>
                    <text x="210" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#signupSilverGradient)]" style={{ letterSpacing: '-3px' }}>Lek</text>
                </>
            )}
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

interface SignupPageProps {
    onSignupSuccess: () => void;
    onNavigate: (page: 'login' | null) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onNavigate }) => {
    // SEO Optimization: Prevent signup page from being indexed but follow links
    useEffect(() => {
        const robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        robotsMeta.content = 'noindex, follow';
        robotsMeta.id = 'auth-robots-meta';
        document.head.appendChild(robotsMeta);
        
        const googleBotMeta = document.createElement('meta');
        googleBotMeta.name = 'googlebot';
        googleBotMeta.content = 'noindex, follow';
        googleBotMeta.id = 'auth-googlebot-meta';
        document.head.appendChild(googleBotMeta);

        return () => {
            const r = document.getElementById('auth-robots-meta');
            const g = document.getElementById('auth-googlebot-meta');
            if (r) document.head.removeChild(r);
            if (g) document.head.removeChild(g);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignupSuccess();
    };

    return (
        <div className="bg-[#080B13] min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <button onClick={() => onNavigate(null)} className="inline-block">
                        <Logo iconOnly />
                    </button>
                    <h1 className="text-3xl font-bold text-white mt-4">Create an account</h1>
                    <p className="text-secondary-text mt-2">Start managing your projects today.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6">
                     <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-secondary-text mb-2">Full Name</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName"
                            required
                            className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-text mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            required
                            className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary-text mb-2">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            required
                            className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-secondary-text mt-6">
                    Already have an account? <button onClick={() => onNavigate('login')} className="font-semibold text-accent-blue hover:underline">Log in</button>
                </p>
                 <p className="text-center text-secondary-text mt-2">
                    <button onClick={() => onNavigate(null)} className="font-semibold text-accent-blue hover:underline">← Back to Home</button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;