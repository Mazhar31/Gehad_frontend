import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '../icons.tsx';
import { authAPI } from '../../services/api';

const Logo: React.FC<{ iconOnly?: boolean }> = ({ iconOnly = false }) => (
    <div className="flex items-center justify-center group cursor-pointer select-none flex-shrink-0">
        <svg 
            viewBox="0 0 340 100" 
            className={`${iconOnly ? 'w-24 h-24' : 'h-14 sm:h-12 md:h-16 w-auto'} transition-transform duration-500 group-hover:scale-105`} 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="resetSilverGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="75%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
            </defs>
            {!iconOnly && (
                <>
                    <text x="10" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#resetSilverGradient)]" style={{ letterSpacing: '-3px' }}>One</text>
                    <text x="210" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#resetSilverGradient)]" style={{ letterSpacing: '-3px' }}>Lek</text>
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

interface ResetPasswordPageProps {
    onNavigate: (page: 'login' | null) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            setError('Invalid reset link. Please request a new password reset.');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid reset token.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            await authAPI.resetPassword(token, password);
            setIsSuccess(true);
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-[#080B13] min-h-screen font-sans flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Logo />
                        <h1 className="text-3xl font-bold text-white mt-4">Password Reset Successful</h1>
                        <p className="text-secondary-text mt-2">Your password has been updated successfully.</p>
                    </div>
                    
                    <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg text-center">
                        <div className="inline-block bg-dark-bg p-3 rounded-full border border-border-color mb-6">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-secondary-text mb-6">You can now log in with your new password.</p>
                        <button 
                            onClick={() => onNavigate('login')} 
                            className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#080B13] min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <button onClick={() => onNavigate(null)} className="inline-block">
                        <Logo />
                    </button>
                    <h1 className="text-3xl font-bold text-white mt-4">Reset Your Password</h1>
                    <p className="text-secondary-text mt-2">Enter your new password below.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary-text mb-2">New Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-text mb-2">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-dark-bg border border-border-color text-white rounded-lg p-3 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                            placeholder="Confirm new password"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button 
                        type="submit" 
                        disabled={isLoading || !token}
                        className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className="text-center text-secondary-text mt-6">
                    <button onClick={() => onNavigate('login')} className="font-semibold text-accent-blue hover:underline">
                        ← Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;