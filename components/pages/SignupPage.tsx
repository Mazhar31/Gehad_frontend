import React from 'react';

const ProjectileLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="32" height="32" viewBox="0 0 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)"/>
        <path d="M19.998 8.5L11.5 23.4975L8 19.9995L16.498 5L19.998 8.5Z" fill="white"/>
        <path d="M24 12.002L15.502 20.5L12 17.002L20.498 8.50403L24 12.002Z" fill="white"/>
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D9F99D"/>
                <stop offset="1" stopColor="#A3E635"/>
            </linearGradient>
        </defs>
    </svg>
);

interface SignupPageProps {
    onSignupSuccess: () => void;
    onNavigate: (page: 'login' | null) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onNavigate }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd have validation and an API call here.
        // For this demo, we'll just call the success handler.
        onSignupSuccess();
    };

    return (
        <div className="bg-[#080B13] min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <button onClick={() => onNavigate(null)} className="inline-block">
                        <ProjectileLogo />
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