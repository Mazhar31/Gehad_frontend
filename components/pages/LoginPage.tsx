import React, { useState, useEffect, useRef } from 'react';
import { EnvelopeIcon, KeyIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';
import { authService } from '../../services/auth';
import SliderVerification from '../SliderVerification.tsx';

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
    const [step, setStep] = useState<'credentials' | 'slider' | 'verification' | 'forgotPassword' | 'resetSent'>('credentials');
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin123');
    const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingRole, setPendingRole] = useState<'admin' | 'user' | null>(null);
    const [pendingToken, setPendingToken] = useState<string | null>(null);
    const [isSliderVerified, setIsSliderVerified] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const initParticles = () => {
            if ((window as any).particlesJS) {
                (window as any).particlesJS('particles-js', {
                    particles: {
                        number: { value: 80, density: { enable: true, value_area: 800 } },
                        color: { value: "#ffffff" },
                        shape: { type: "circle" },
                        opacity: { value: 0.5, random: false },
                        size: { value: 3, random: true },
                        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                        move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
                        modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
                    },
                    retina_detect: true
                });
            }
        };

        // Ensure script is loaded
        if ((window as any).particlesJS) {
            initParticles();
        } else {
            const interval = setInterval(() => {
                if ((window as any).particlesJS) {
                    initParticles();
                    clearInterval(interval);
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, []);

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Try admin login first
            let result = await authService.adminLogin(email, password);
            let loginType: 'admin' | 'user' = 'admin';
            
            // If admin login fails, try user login
            if (!result.success) {
                result = await authService.userLogin(email, password);
                loginType = 'user';
            }

            if (result.success) {
                // Store token temporarily, don't save to localStorage yet
                setPendingRole(loginType);
                setPendingToken(result.token || null);
                setStep('slider');
            } else {
                setError(result.error || 'Invalid email or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const code = verificationCode.join('');
        
        try {
            if (!pendingRole) {
                setError('Session expired. Please login again.');
                setStep('credentials');
                return;
            }

            const result = pendingRole === 'admin'
                ? await authService.adminVerify2FA(code)
                : await authService.userVerify2FA(code);

            if (result.success) {
                onLoginSuccess(pendingRole, email);
            } else {
                setError(result.error || 'Invalid verification code');
            }
        } catch (err) {
            console.error('2FA verification error:', err);
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const { authAPI } = await import('../../services/api');
            await authAPI.forgotPassword(email);
            setStep('resetSent');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setVerificationCode([...verificationCode.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== '' && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move focus to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !verificationCode[index] && e.currentTarget.previousSibling) {
            (e.currentTarget.previousSibling as HTMLInputElement).focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData('text');
        if (/^\d{6}$/.test(paste)) {
            const digits = paste.split('');
            setVerificationCode(digits);
            // Focus the last input after paste
            if (inputRefs.current[5]) {
                inputRefs.current[5]!.focus();
            }
        }
    };


    const handleSliderVerified = () => {
        setIsSliderVerified(true);
        // Show tick mark for 1.5 seconds before redirecting
        setTimeout(() => {
            if (pendingRole && pendingToken) {
                // Now save the token to localStorage
                localStorage.setItem('auth_token', pendingToken);
                localStorage.setItem('user_role', pendingRole);
                if (pendingRole === 'user') {
                    localStorage.setItem('user_email', email);
                }
                onLoginSuccess(pendingRole, email);
            }
        }, 1500);
    };

    const handleSliderReset = () => {
        setIsSliderVerified(false);
    };


    const getTitle = () => {
        switch (step) {
            case 'credentials': return 'Log in to OneQlek';
            case 'slider': return 'Security Verification';
            case 'verification': return 'Two-Factor Authentication';
            case 'forgotPassword': return 'Reset Your Password';
            case 'resetSent': return 'Check Your Email';
            default: return '';
        }
    };

    const getDescription = () => {
        switch (step) {
            case 'credentials': return 'Welcome back! Please enter your details.';
            case 'slider': return 'Please complete the slider verification to continue.';
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
        <div className="bg-[#080B13] min-h-screen font-sans flex items-center justify-center p-4 relative overflow-hidden">
            {/* Particles Background */}
            <div id="particles-js" className="absolute inset-0 z-0"></div>

            <div className="w-full max-w-md relative z-10">
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
                
                {step === 'slider' && (
                    <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <p className="text-secondary-text">Complete the verification to proceed</p>
                        </div>
                        <SliderVerification 
                            onVerified={handleSliderVerified}
                            onReset={handleSliderReset}
                        />
                        <button 
                            type="button" 
                            onClick={() => setStep('credentials')} 
                            className="w-full text-secondary-text hover:text-white text-sm mt-4"
                        >
                            ← Back to login
                        </button>
                    </div>
                )}
                
                {step === 'credentials' && (
                    <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg backdrop-blur-sm">
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
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'verification' && (
                     <form onSubmit={handleVerificationSubmit} className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 backdrop-blur-sm">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-4 text-center">Verification Code</label>
                             <div className="flex justify-center gap-2" onPaste={handlePaste}>
                                {verificationCode.map((data, index) => {
                                    return (
                                        <input
                                            className="w-12 h-14 text-center text-2xl font-bold bg-dark-bg border border-border-color text-white rounded-lg focus:ring-2 focus:ring-accent-blue focus:outline-none"
                                            type="tel"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            autoComplete="one-time-code"
                                            name="otp"
                                            maxLength={1}
                                            key={index}
                                            value={data}
                                            onChange={e => handleCodeChange(e.target, index)}
                                            onFocus={e => e.target.select()}
                                            onKeyDown={e => handleKeyDown(e, index)}
                                            ref={el => inputRefs.current[index] = el}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>
                )}

                {step === 'forgotPassword' && (
                     <form onSubmit={handleForgotPasswordSubmit} className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 backdrop-blur-sm">
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
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {step === 'resetSent' && (
                     <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 text-center backdrop-blur-sm">
                         <div className="inline-block bg-dark-bg p-3 rounded-full border border-border-color">
                            <EnvelopeIcon className="w-6 h-6 text-accent-green" />
                        </div>
                        <button onClick={() => setStep('credentials')} className="w-full bg-accent-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-opacity">
                           Back to Login
                        </button>
                    </div>
                )}

                 <p className="text-center text-secondary-text mt-6">
                    <button onClick={goBack} className="font-semibold text-accent-blue hover:underline relative z-20">
                        {step === 'credentials' ? '← Back to Home' : '← Back to Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;