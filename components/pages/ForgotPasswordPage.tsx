import React, { useState } from 'react';
import { authAPI } from '../../services/api';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.message);
      setIsSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send reset email');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
          <p className="mt-2 text-secondary-text">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${isSuccess ? 'bg-green-900/20 border border-green-500/50 text-green-400' : 'bg-red-900/20 border border-red-500/50 text-red-400'}`}>
            {message}
          </div>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-card-bg border border-border-color rounded-lg px-4 py-3 text-white placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-blue text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={onBack}
            className="text-accent-blue hover:text-blue-400 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;