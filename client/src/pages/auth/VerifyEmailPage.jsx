import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        if (res.data.success) {
          setSuccess(true);
          setMessage(res.data.message);
          if (res.data.data.token) {
            localStorage.setItem('kit_token', res.data.data.token);
            localStorage.setItem('kit_user', JSON.stringify(res.data.data.user));
          }
        }
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Verification failed or token expired.');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-4">
        {loading ? (
          <div className="space-y-4 py-8">
            <Loader2 className="w-12 h-12 text-brand-700 animate-spin mx-auto" />
            <h3 className="font-heading text-lg font-bold text-slate-800">Verifying Email Address...</h3>
          </div>
        ) : success ? (
          <div className="space-y-4 py-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="font-heading text-2xl font-extrabold text-slate-900">Email Verified!</h2>
            <p className="text-sm text-slate-600">{message}</p>
            <div className="pt-4">
              <Link
                to="/dashboard"
                className="inline-block px-6 py-2.5 bg-brand-700 text-white font-semibold rounded-lg text-sm hover:bg-brand-800 transition-colors shadow-md"
              >
                Go to Student Dashboard →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <AlertCircle className="w-16 h-16 text-rose-600 mx-auto" />
            <h2 className="font-heading text-2xl font-extrabold text-slate-900">Verification Failed</h2>
            <p className="text-sm text-slate-600">{message}</p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 bg-brand-700 text-white font-semibold rounded-lg text-xs hover:bg-brand-800"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
