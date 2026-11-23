import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { RippleButton } from './ui/RippleButton';

interface AuthModalProps {
  open: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onAuthenticate: (name: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  initialMode = 'signin',
  onClose,
  onAuthenticate,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const resolvedName =
      mode === 'signup'
        ? name.trim()
        : email.split('@')[0]?.replace(/[._-]/g, ' ') || 'Member';

    onAuthenticate(resolvedName, email);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white border border-[#D2D2D7] p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close authentication modal"
              className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="mb-6">
              <div className="inline-flex p-1 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    mode === 'signin'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    mode === 'signup'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <h2
                id="auth-modal-title"
                className="text-2xl font-bold tracking-[-0.025em] text-[#1D1D1F]"
              >
                {mode === 'signin'
                  ? 'Sign in to iUnlocker'
                  : 'Create your iUnlocker account'}
              </h2>
              <p className="mt-1 text-xs text-[#6E6E73]">
                Save preferences and unlock support details across sessions.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-[#FFF2F2] border border-[#F5C2C0] px-3.5 py-2.5 text-xs text-[#B3261E]"
                >
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Taylor"
                    className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/60 focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/60 focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/60 focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                />
              </div>

              <RippleButton type="submit" variant="primary" size="lg" fullWidth>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </RippleButton>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
