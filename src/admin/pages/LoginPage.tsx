// src/admin/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { signInAdmin } from '../../lib/auth';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string }; error?: string } };
  const { user, isStaff, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.error === 'not_authorized') {
      setError('Your account is not authorized. Contact a full admin to grant access.');
    }
  }, [location.state]);

  if (!authLoading && user && isStaff) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInAdmin(email, password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') setError('Invalid email or password.');
      else if (code === 'auth/user-not-found') setError('No account found with that email.');
      else if (code === 'auth/too-many-requests') setError('Too many attempts. Try again later.');
      else setError(err?.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center text-white font-black text-2xl">
            S
          </div>
          <h1 className="mt-4 text-2xl font-black text-[#0F0F14] tracking-tight">SETHIZZZ Admin</h1>
          <p className="text-sm text-[#6B6B76] mt-1">Sign in to manage your store</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#EEEEF0] p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0F0F14] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B76]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                className="w-full h-11 pl-10 pr-3 bg-[#F7F7F9] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                placeholder="you@sethizzz.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F0F14] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B76]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full h-11 pl-10 pr-3 bg-[#F7F7F9] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#F97316] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-xs text-center text-[#6B6B76]">
            Admin access is invite-only. Contact a full admin to get set up.
          </p>
        </form>
      </div>
    </div>
  );
};
