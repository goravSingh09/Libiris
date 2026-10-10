import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, AlertCircle, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';

export const StudentLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Account Activation modal state
  const [showActivate, setShowActivate] = useState(false);
  const [activateData, setActivateData] = useState({ student_id: '', mobile: '', new_password: '' });
  const [activateMsg, setActivateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier || !password) {
      setError('Please provide your Student ID/Email/Mobile and Password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.studentLogin({ identifier, password });
      if (res.success) {
        login(res.token, 'student', res.user);
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivateMsg(null);
    try {
      const res = await api.activateStudent({
        student_id: activateData.student_id,
        mobile: activateData.mobile,
        password: activateData.new_password
      });
      if (res.success) {
        setActivateMsg({ type: 'success', text: res.message });
        setTimeout(() => setShowActivate(false), 2000);
      }
    } catch (err: any) {
      setActivateMsg({ type: 'error', text: err.message || 'Activation failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-950 rounded-3xl p-8 sm:p-10 border border-navy-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-navy-900 border-2 border-gold-500 overflow-hidden mx-auto flex items-center justify-center shadow-inner">
            <img src="/logo.png" alt="Library Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Student Portal Login
          </h2>
          <p className="text-xs text-gold-400 font-medium">
            Shree Bala Ji Adhyayan Kendra Library
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Student ID, Email or Mobile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. SBL0001 or mobile number"
                className="w-full pl-10 pr-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your portal password"
                className="w-full pl-10 pr-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3.5 rounded-xl text-sm transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Student Portal</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-navy-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => setShowActivate(true)}
              className="text-gold-400 hover:underline flex items-center space-x-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Activate / Set Password</span>
            </button>
            <Link to="/forgot-password" className="hover:text-slate-200 transition">
              Forgot Password?
            </Link>
          </div>
          <div className="text-center text-xs text-slate-400">
            Don't have an admission yet?{' '}
            <Link to="/admission" className="text-gold-400 font-bold hover:underline">
              Apply Online
            </Link>
          </div>
        </div>

      </div>

      {/* Account Activation Dialog */}
      {showActivate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-navy-950 border border-navy-800 rounded-2xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-gold-400">Activate Student Account</h3>
              <button onClick={() => setShowActivate(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-300">
              For approved students to set or update their initial password.
            </p>

            {activateMsg && (
              <div className={`p-3 rounded-lg text-xs ${activateMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {activateMsg.text}
              </div>
            )}

            <form onSubmit={handleActivateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Student ID (e.g. SBL0001)</label>
                <input
                  type="text"
                  required
                  value={activateData.student_id}
                  onChange={(e) => setActivateData({ ...activateData, student_id: e.target.value })}
                  className="w-full p-2 bg-navy-900 border border-navy-800 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Registered 10-Digit Mobile</label>
                <input
                  type="tel"
                  required
                  value={activateData.mobile}
                  onChange={(e) => setActivateData({ ...activateData, mobile: e.target.value })}
                  className="w-full p-2 bg-navy-900 border border-navy-800 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  value={activateData.new_password}
                  onChange={(e) => setActivateData({ ...activateData, new_password: e.target.value })}
                  className="w-full p-2 bg-navy-900 border border-navy-800 rounded text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold-500 text-navy-950 font-bold py-2.5 rounded-lg text-xs mt-2"
              >
                Set Password & Activate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
