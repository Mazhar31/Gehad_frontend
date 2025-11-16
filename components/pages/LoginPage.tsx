import React, { useState } from 'react';
import { EnvelopeIcon, KeyIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';

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

interface LoginPageProps {
    onLoginSuccess: (role: 'admin' | 'user', userEmail?: string) => void;
    onNavigate: (page: null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const { users } = useData();
    const [step, setStep] = useState<'credentials' | 'forgotPassword' | 'resetSent'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Check for admin user
        if (email.toLowerCase() === 'admin@example.com' && password === 'password123') {
            onLoginSuccess('admin');
            return;
        }
        
        // Check for demo user
        if (email.toLowerCase() === 'user@example.com' && password === 'password123') {
            // Log in as the first user from the data for demo purposes.
            const demoUserEmail = users[0]?.email;
            if (demoUserEmail) {
                onLoginSuccess('user', demoUserEmail);
            } else {
                setError("No demo user is available in the system.");
            }
            return;
        }
        
        // Check for a regular user
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.password === password) {
            onLoginSuccess('user', user.email);
            return;
        }

        setError('Invalid email or password.');
    };

    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Check if email exists in either admin or users list
        const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (email.toLowerCase() === 'admin@example.com' || userExists) {
            console.log(`Password reset requested for ${email}`);
            setStep('resetSent');
        } else {
            setError('This email address is not registered.');
        }
    };

    const getTitle = () => {
        switch (step) {
            case 'credentials': return 'Log in to OneQlek';
            case 'forgotPassword': return 'Reset Your Password';
            case 'resetSent': return 'Check Your Email';
            default: return '';
        }
    };

    const getDescription = () => {
        switch (step) {
            case 'credentials': return 'Welcome back! Please enter your details.';
            case 'forgotPassword': return 'Enter your email address and we will send you a link to reset your password.';
            case 'resetSent': return `We've sent a password reset link to ${email}. Please check your inbox.`;
            default: return '';
        }
    };

    const goBack = () => {
        setError('');
        if (step === 'credentials') {
            onNavigate(null);
        } else {
            setStep('credentials');
        }
    };

    return (
        <div className="bg-[#080B13] min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <button onClick={() => onNavigate(null)} className="inline-block">
                        <ProjectileLogo />
                    </button>
                    <h1 className="text-3xl font-bold text-white mt-4">
                        {getTitle()}
                    </h1>
                    <p className="text-secondary-text mt-2">
                       {getDescription()}
                    </p>
                </div>
                
                {step === 'credentials' && (
                    <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg">
                        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-secondary-text mb-2">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-secondary-text">Password</label>
                                    <button type="button" onClick={() => setStep('forgotPassword')} className="text-sm text-accent-blue hover:underline">Forgot password?</button>
                                </div>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            <button type="submit" className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                                Log In
                            </button>
                        </form>
                        <div className="text-center text-secondary-text text-sm mt-6 pt-6 border-t border-border-color space-y-2">
                            <h4 className="font-semibold text-primary-text mb-2">Demo Credentials</h4>
                            <p><strong>Admin:</strong> <code className="bg-dark-bg text-accent-lime px-1 py-0.5 rounded">admin@example.com</code> / <code className="bg-dark-bg text-accent-lime px-1 py-0.5 rounded">password123</code></p>
                            <p><strong>User:</strong> <code className="bg-dark-bg text-accent-lime px-1 py-0.5 rounded">user@example.com</code> / <code className="bg-dark-bg text-accent-lime px-1 py-0.5 rounded">password123</code></p>
                        </div>
                    </div>
                )}

                {step === 'forgotPassword' && (
                     <form onSubmit={handleForgotPasswordSubmit} className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-secondary-text mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="reset-email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                           Send Reset Link
                        </button>
                    </form>
                )}

                {step === 'resetSent' && (
                     <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 text-center">
                         <div className="inline-block bg-dark-bg p-3 rounded-full border border-border-color">
                            <EnvelopeIcon className="w-6 h-6 text-accent-green" />
                        </div>
                        <button onClick={() => setStep('credentials')} className="w-full bg-accent-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-opacity">
                           Back to Login
                        </button>
                    </div>
                )}


                 <p className="text-center text-secondary-text mt-6">
                    <button onClick={goBack} className="font-semibold text-accent-blue hover:underline">
                        {step === 'credentials' ? '← Back to Home' : '← Back to Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;