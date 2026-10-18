import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Shield, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-navy-900 border-b border-navy-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500 bg-navy-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <img 
                src="/logo.png" 
                alt="Shree Bala Ji Library Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback icon if image not found
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <BookOpen className="w-6 h-6 text-gold-500 hidden" />
            </div>
            <div>
              <span className="block text-lg font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors">
                Shree Bala Ji Adhyayan Kendra
              </span>
              <span className="block text-xs uppercase tracking-wider text-gold-400 font-semibold">
                Library Management System (SBLMS)
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/admission" className="text-sm font-medium text-slate-200 hover:text-gold-400 transition-colors">
              Online Admission
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-navy-700">
                <Link
                  to={userType === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="flex items-center space-x-2 text-sm font-semibold bg-navy-800 text-gold-400 px-3.5 py-2 rounded-lg border border-gold-500/30 hover:bg-navy-700 transition"
                >
                  <User className="w-4 h-4" />
                  <span>{userType === 'admin' ? 'Admin Portal' : 'Student Portal'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-navy-700">
                <Link
                  to="/student/login"
                  className="text-sm font-medium text-slate-200 hover:text-white px-3 py-1.5 rounded-md hover:bg-navy-800 transition"
                >
                  Student Login
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center space-x-1.5 text-sm font-medium bg-gold-500 text-navy-950 px-4 py-2 rounded-md hover:bg-gold-400 transition font-semibold shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Desk</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile links */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/admission"
              className="text-xs bg-gold-500 text-navy-950 font-bold px-3 py-1.5 rounded"
            >
              Apply
            </Link>
            <Link
              to={user ? (userType === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/student/login'}
              className="text-xs bg-navy-800 text-slate-200 px-2.5 py-1.5 rounded border border-navy-700"
            >
              {user ? 'Portal' : 'Login'}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};
