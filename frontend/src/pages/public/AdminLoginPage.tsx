import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      setLoading(true);
      const res = await api.adminLogin({ username, password });
      if (res.success) {
        login(res.token, 'admin', res.user);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
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
            Administrator Desk
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
              Admin Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
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
                placeholder="Enter password"
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
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
          <Link to="/forgot-password" className="hover:text-gold-400 transition">
            Forgot Password?
          </Link>
          <Link to="/" className="hover:text-slate-200 transition">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};
