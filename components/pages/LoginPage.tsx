import React, { useState, useEffect, useRef } from "react";
import { EnvelopeIcon, KeyIcon } from "../icons.tsx";
import { useData } from "../DataContext.tsx";
import SliderVerification from "../SliderVerification.tsx";
import { authService } from "../../services/auth";

const ProjectileLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)" />
    <path
      d="M19.998 8.5L11.5 23.4975L8 19.9995L16.498 5L19.998 8.5Z"
      fill="white"
    />
    <path
      d="M24 12.002L15.502 20.5L12 17.002L20.498 8.50403L24 12.002Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="logo-gradient"
        x1="0"
        y1="0"
        x2="32"
        y2="32"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9F99D" />
        <stop offset="1" stopColor="#A3E635" />
      </linearGradient>
    </defs>
  </svg>
);

interface LoginPageProps {
  onLoginSuccess: (role: "admin" | "user", userEmail?: string) => void;
  onNavigate: (page: null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const { users } = useData();
  const [step, setStep] = useState<
    "credentials" | "forgotPassword" | "resetSent" | "sliderVerification"
  >("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    const initParticles = () => {
      if ((window as any).particlesJS) {
        (window as any).particlesJS("particles-js", {
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 6,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 400, line_linked: { opacity: 1 } },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3,
              },
              repulse: { distance: 200, duration: 0.4 },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 },
            },
          },
          retina_detect: true,
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
    setError("");
    setIsLoading(true);

    try {
      // Try admin login first
      const adminResult = await authService.adminLogin(email, password);

      if (adminResult.success) {
        if (adminResult.requires2FA) {
          setLoginType("admin");
          setStep("sliderVerification");
        } else if (adminResult.token) {
          setPendingToken(adminResult.token);
          setLoginType("admin");
          setStep("sliderVerification");
        }
        setIsLoading(false);
        return;
      }

      // If admin login fails, try user login
      const userResult = await authService.userLogin(email, password);

      if (userResult.success) {
        if (userResult.requires2FA) {
          setLoginType("user");
          setStep("sliderVerification");
        } else if (userResult.token) {
          setPendingToken(userResult.token);
          setLoginType("user");
          setStep("sliderVerification");
        }
      } else {
        setError(userResult.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call the forgot password API
      // Note: You'll need to implement this in your authService
      console.log(`Password reset requested for ${email}`);
      setStep("resetSent");
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliderSuccess = async () => {
    console.log('🎯 Slider verification successful');
    console.log('🔑 Pending token:', !!pendingToken);
    console.log('👤 Login type:', loginType);
    console.log('📧 Email:', email);
    
    if (!pendingToken || !loginType) {
      console.error('❌ Missing token or login type');
      return;
    }

    try {
      // Store the token and complete login
      localStorage.setItem("auth_token", pendingToken);
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
      case "credentials":
        return "Log in to OneQlek";
      case "forgotPassword":
        return "Reset Your Password";
      case "resetSent":
        return "Check Your Email";
      case "sliderVerification":
        return "Security Verification";
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (step) {
      case "credentials":
        return "Welcome back! Please enter your details.";
      case "forgotPassword":
        return "Enter your email address and we will send you a link to reset your password.";
      case "resetSent":
        return `We've sent a password reset link to ${email}. Please check your inbox.`;
      case "sliderVerification":
        return "Please complete the security verification to continue.";
      default:
        return "";
    }
  };

  const goBack = () => {
    setError("");
    if (step === "credentials") {
      onNavigate(null);
    } else {
      setStep("credentials");
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
          <h1 className="text-3xl font-bold text-white mt-4">{getTitle()}</h1>
          <p className="text-secondary-text mt-2">{getDescription()}</p>
        </div>

        {step === "credentials" && (
          <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg backdrop-blur-sm">
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-text mb-2"
                >
                  Email
                </label>
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-secondary-text"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("forgotPassword")}
                    className="text-sm text-accent-blue hover:underline"
                  >
                    Forgot password?
                  </button>
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
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        )}

        {step === "forgotPassword" && (
          <form
            onSubmit={handleForgotPasswordSubmit}
            className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 backdrop-blur-sm"
          >
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-secondary-text mb-2"
              >
                Email Address
              </label>
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
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-lime text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {step === "sliderVerification" && (
          <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 backdrop-blur-sm">
            <SliderVerification onSuccess={handleSliderSuccess} />
            <button
              onClick={() => {
                setStep("credentials");
                setPendingToken(null);
                setLoginType(null);
              }}
              className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-opacity"
            >
              Back to Login
            </button>
          </div>
        )}

        {step === "resetSent" && (
          <div className="bg-card-bg/80 border border-border-color p-8 rounded-2xl shadow-lg space-y-6 text-center backdrop-blur-sm">
            <div className="inline-block bg-dark-bg p-3 rounded-full border border-border-color">
              <EnvelopeIcon className="w-6 h-6 text-accent-green" />
            </div>
          </div>
        )}

        {(step === 'credentials' || step === 'forgotPassword' || step === 'resetSent') && (
          <p className="text-center text-secondary-text mt-6">
            <button onClick={goBack} className="font-semibold text-accent-blue hover:underline relative z-20">
              {step === 'credentials' ? '← Back to Home' : '← Back to Login'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
