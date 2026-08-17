import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverified(false);
    setResendMsg('');

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else if (res.data.user.role === 'clubHead') {
          navigate('/club-dashboard');
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid credentials.';
      setError(msg);
      if (msg.includes('verify your email')) {
        setIsUnverified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post('/auth/resend-verification', { email });
      setResendMsg('Verification email resent! Check your inbox / dev link.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend email');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 bg-brand-700 text-white rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-md">
            KIT
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900">Sign In to Portal</h2>
          <p className="text-xs text-slate-500 mt-1">KIT Club Discovery, Recruitment & Events</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            {isUnverified && (
              <button
                type="button"
                onClick={handleResend}
                className="block text-brand-700 font-bold underline hover:text-brand-900"
              >
                Click here to resend verification email
              </button>
            )}
          </div>
        )}

        {resendMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium">
            {resendMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. head.robotics@kitkop.edu.in"
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700 focus:border-transparent"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-brand-700 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700 focus:border-transparent"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-brand-700 font-bold hover:underline">
            Register as a Student
          </Link>
        </div>

      </div>
    </div>
  );
};
