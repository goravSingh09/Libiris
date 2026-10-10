import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { KeyRound, Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!identifier) return;

    try {
      setLoading(true);
      const res = await api.forgotPassword(identifier);
      if (res.success) {
        setMsg({ type: 'success', text: res.message });
        if (res.reset_token) {
          setResetToken(res.reset_token);
        }
        setStep(2);
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!resetToken || newPassword.length < 6) {
      setMsg({ type: 'error', text: 'Token and new password (min 6 characters) required.' });
      return;
    }

    try {
      setLoading(true);
      const res = await api.resetPassword({ token: resetToken, new_password: newPassword });
      if (res.success) {
        setMsg({ type: 'success', text: res.message });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Password reset failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-950 rounded-3xl p-8 sm:p-10 border border-navy-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-navy-900 border border-gold-500/40 text-gold-400 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">Password Recovery</h2>
          <p className="text-xs text-slate-400">
            {step === 1 ? 'Enter your registered email, username, or Student ID' : 'Enter reset token and your new password'}
          </p>
        </div>

        {msg && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
            msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Identifier
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email, username, or Student ID"
                className="w-full px-3.5 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3 rounded-xl text-sm transition"
            >
              {loading ? 'Processing...' : 'Generate Reset Token'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste token received"
                className="w-full px-3.5 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password (Min 6 Characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3.5 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3 rounded-xl text-sm transition"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
          <Link to="/student/login" className="flex items-center space-x-1 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </Link>
          <Link to="/admin/login" className="hover:text-gold-400">
            Admin Login
          </Link>
        </div>

      </div>
    </div>
  );
};
