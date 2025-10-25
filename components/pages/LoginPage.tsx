import React, { useState } from 'react';
import { EnvelopeIcon, KeyIcon } from '../icons.tsx';

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
    onLoginSuccess: (role: 'admin' | 'user') => void;
    onNavigate: (page: null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const [step, setStep] = useState<'credentials' | 'verification' | 'forgotPassword' | 'resetSent'>('credentials');
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password123');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [pendingRole, setPendingRole] = useState<'admin' | 'user' | null>(null);

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (email.toLowerCase() === 'admin@example.com') {
            if (password === 'password123') {
                setPendingRole('admin');
                setStep('verification');
            } else {
                setError('Invalid email or password.');
            }
        } else {
            // For demonstration, any other email grants access to the user dashboard after 2FA.
            setPendingRole('user');
            setStep('verification');
        }
    };

    const handleVerificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (verificationCode === '555555' && pendingRole) {
            onLoginSuccess(pendingRole);
        } else {
            setError('Invalid verification code.');
        }
    };

    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (email.toLowerCase() === 'admin@example.com') {
            console.log(`Password reset requested for ${email}`);
            setStep('resetSent');
        } else {
            setError('This email address is not registered.');
        }
    };

    const getTitle = () => {
        switch (step) {
            case 'credentials': return 'Log in to Projectile';
            case 'verification': return 'Two-Factor Authentication';
            case 'forgotPassword': return 'Reset Your Password';
            case 'resetSent': return 'Check Your Email';
            default: return '';
        }
    };

    const getDescription = () => {
        switch (step) {
            case 'credentials': return 'Welcome back! Please enter your details.';
            case 'verification': return 'Please enter the 6-digit code from your authenticator app.';
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
                    <form onSubmit={handleCredentialsSubmit} className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6">
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
                )}

                {step === 'verification' && (
                     <form onSubmit={handleVerificationSubmit} className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-secondary-text mb-2 text-center">Verification Code</label>
                            <input 
                                type="text" 
                                id="verificationCode" 
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                maxLength={6}
                                className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 text-center text-2xl tracking-[1em] focus:ring-2 focus:ring-accent-blue focus:outline-none"
                                placeholder="_ _ _ _ _ _"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                           Verify
                        </button>
                    </form>
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