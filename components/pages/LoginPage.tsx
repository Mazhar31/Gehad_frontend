import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, KeyIcon } from '../icons.tsx';
import { useData } from '../DataContext.tsx';
import SliderVerification from '../SliderVerification.tsx';
import { authService } from '../../services/auth';
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
                <linearGradient id="loginSilverGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="75%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
            </defs>
            {!iconOnly && (
                <>
                    <text x="10" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#loginSilverGradient)]" style={{ letterSpacing: '-3px' }}>One</text>
                    <text x="210" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#loginSilverGradient)]" style={{ letterSpacing: '-3px' }}>Lek</text>
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

interface LoginPageProps {
    onLoginSuccess: (role: 'admin' | 'user', userEmail?: string) => void;
    onNavigate: (page: 'signup' | null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const { users } = useData();
    const [step, setStep] = useState<'credentials' | 'forgotPassword' | 'resetSent' | 'sliderVerification'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingToken, setPendingToken] = useState<string | null>(null);
    const [loginType, setLoginType] = useState<'admin' | 'user' | null>(null);

    // SEO Optimization: Auth pages should be noindex but allow link following
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
        setIsLoading(true);

        try {
            // Try admin login first
            const adminResult = await authService.adminLogin(email, password);

            if (adminResult.success) {
                if (adminResult.requires2FA) {
                    setLoginType('admin');
                    setStep('sliderVerification');
                } else if (adminResult.token) {
                    setPendingToken(adminResult.token);
                    setLoginType('admin');
                    setStep('sliderVerification');
                }
                setIsLoading(false);
                return;
            }

            // If admin login fails, try user login
            const userResult = await authService.userLogin(email, password);

            if (userResult.success) {
                if (userResult.requires2FA) {
                    setLoginType('user');
                    setStep('sliderVerification');
                } else if (userResult.token) {
                    setPendingToken(userResult.token);
                    setLoginType('user');
                    setStep('sliderVerification');
                }
            } else {
                // Fallback to demo logic for development
                if (email.toLowerCase() === 'admin@example.com' && password === 'password123') {
                    onLoginSuccess('admin');
                    return;
                }
                
                if (email.toLowerCase() === 'user@example.com' && password === 'password123') {
                    const demoUserEmail = USERS_DATA[0]?.email;
                    if (demoUserEmail) {
                        onLoginSuccess('user', demoUserEmail);
                    } else {
                        setError("No demo user is available in the system.");
                    }
                    return;
                }
                
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                if (user && user.password === password) {
                    onLoginSuccess('user', user.email);
                    return;
                }

                setError(userResult.error || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authAPI.forgotPassword(email);
            console.log(`Password reset requested for ${email}`);
            setStep('resetSent');
        } catch (error) {
            console.error('Forgot password error:', error);
            // Fallback for demo
            const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (email.toLowerCase() === 'admin@example.com' || userExists) {
                console.log(`Password reset requested for ${email}`);
                setStep('resetSent');
            } else {
                setError('This email address is not registered.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSliderSuccess = async () => {
        console.log('🎯 Slider verification successful');
        console.log('🔑 Pending token:', !!pendingToken);
        console.log('👤 Login type:', loginType);
        console.log('📧 Email:', email);
        
        if (!loginType) {
            console.error('❌ Missing login type');
            return;
        }

        try {
            if (pendingToken) {
                localStorage.setItem("auth_token", pendingToken);
            }
            localStorage.setItem("user_role", loginType);
            if (loginType === "user") {
                localStorage.setItem("user_email", email);
            }

            console.log('✅ Calling onLoginSuccess with:', loginType, loginType === "user" ? email : undefined);
            onLoginSuccess(loginType, loginType === "user" ? email : undefined);
        } catch (error) {
            console.error("Login completion failed:", error);
            setError("Login completion failed. Please try again.");
            setStep("credentials");
        }
    };

    const getTitle = () => {
        switch (step) {
            case 'credentials': return 'Login Here!';
            case 'forgotPassword': return 'Reset Your Password';
            case 'resetSent': return 'Check Your Email';
            case 'sliderVerification': return 'Security Verification';
            default: return '';
        }
    };

    const getDescription = () => {
        switch (step) {
            case 'credentials': return 'Welcome back! Please enter your details.';
            case 'forgotPassword': return 'Enter your email address and we will send you a link to reset your password.';
            case 'resetSent': return `We've sent a password reset link to ${email}. Please check your inbox.`;
            case 'sliderVerification': return 'Please complete the security verification to continue.';
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
            <div id="particles-js" className="absolute inset-0 z-0"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <button onClick={() => onNavigate(null)} className="inline-block hover:scale-110 transition-transform">
                        <Logo />
                    </button>
                    <h1 className="text-3xl font-bold text-white mt-4">
                        {getTitle()}
                    </h1>
                    <p className="text-secondary-text mt-2">
                       {getDescription()}
                    </p>
                </div>
                
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
                                disabled={isLoading}
                                className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>
                    </div>
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
                            disabled={isLoading}
                            className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {step === 'sliderVerification' && (
                    <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 backdrop-blur-sm">
                        <SliderVerification onSuccess={handleSliderSuccess} />
                        <button
                            onClick={() => {
                                setStep('credentials');
                                setPendingToken(null);
                                setLoginType(null);
                            }}
                            className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-opacity"
                        >
                            Back to Login
                        </button>
                    </div>
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

// Static import from constants for demo logic
const USERS_DATA = [
  { id: 'u-1', name: 'Alice Martin', email: 'alice.m@innovate.com', position: 'Project Manager', clientId: 'c-1', avatarUrl: 'https://i.pravatar.cc/150?u=u1', role: 'superuser', password: 'password', dashboardAccess: 'view-and-edit', projectIds: ['p-1', 'p-5', 'p-6'] }
];

export default LoginPage;