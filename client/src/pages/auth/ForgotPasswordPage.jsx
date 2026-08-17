import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Mail, KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMsg(res.data.message);
        if (res.data.data?.resetToken) {
          setResetToken(res.data.data.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 bg-brand-700 text-white rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900">Reset Your Password</h2>
          <p className="text-xs text-slate-500 mt-1">Enter your registered email address below</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {msg ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-heading font-bold text-emerald-900 text-base">Reset Request Sent</h3>
            <p className="text-xs text-emerald-800">{msg}</p>

            {resetToken && (
              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-left text-xs space-y-1">
                <p className="font-semibold text-slate-700">Dev Password Reset Link:</p>
                <Link
                  to={`/reset-password/${resetToken}`}
                  className="text-brand-700 font-bold underline break-all hover:text-brand-900"
                >
                  Click here to set new password →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Password Reset Token'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link to="/login" className="text-xs text-slate-600 font-medium hover:text-brand-700 inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
