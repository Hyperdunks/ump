import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';
import { PageView } from '../types';

interface AuthProps {
  view: 'signin' | 'signup';
  onNavigate: (view: PageView) => void;
  onAuth: () => void;
}

export const AuthPages: React.FC<AuthProps> = ({ view, onNavigate, onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAuth();
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simulate Google Auth
    setTimeout(() => {
      setIsLoading(false);
      onAuth();
    }, 1500);
  };

  const isSignIn = view === 'signin';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-parchment relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-almond-silk/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-dust-grey/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-linen border border-dust-grey rounded-2xl shadow-xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-foreground text-parchment rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-foreground mb-2">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-foreground-muted text-sm mb-8">
            {isSignIn
              ? 'Enter your credentials to access the dashboard'
              : 'Start monitoring your services in minutes'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-almond-silk focus:ring-1 focus:ring-almond-silk transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-almond-silk focus:ring-1 focus:ring-almond-silk transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-almond-silk focus:ring-1 focus:ring-almond-silk transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-parchment py-3 rounded-lg font-medium hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 mt-6 shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignIn ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-dust-grey/50 flex-1" />
            <span className="text-xs text-foreground-muted uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-dust-grey/50 flex-1" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full bg-white border border-dust-grey hover:bg-parchment text-foreground py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <div className="mt-6 text-center text-sm text-foreground-muted">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onNavigate(isSignIn ? 'signup' : 'signin')}
              className="text-foreground font-semibold hover:underline"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="bg-parchment/50 p-4 border-t border-dust-grey/50 text-center">
          <p className="text-xs text-foreground-muted">Protected by Sentinel Security</p>
        </div>
      </motion.div>
    </div>
  );
};