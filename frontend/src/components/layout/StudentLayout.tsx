import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  CalendarCheck,
  User,
  LogOut,
  Armchair,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types/sblms';

export const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const student = user as Student;
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Fees & Receipts', path: '/student/fees', icon: Receipt },
    { label: 'My Attendance', path: '/student/attendance', icon: CalendarCheck },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/student/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Student Top Bar */}
      <header className="bg-navy-950 text-white border-b border-navy-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Library Brand & Student Info */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500 bg-navy-900 shrink-0">
                <img src="/logo.png" alt="Library Logo" className="w-full h-full object-cover" />
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {student?.full_name || 'Student Portal'}
                  </h1>
                  <span className="text-xs bg-gold-500/20 text-gold-400 font-bold px-2 py-0.5 rounded border border-gold-500/30">
                    {student?.student_id || 'SBL'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-300 mt-0.5">
                  <span className="flex items-center space-x-1 text-teal-300">
                    <Armchair className="w-3.5 h-3.5" />
                    <span>{student?.seat_number ? `Seat No. ${student.seat_number}` : 'Seat Unallocated'}</span>
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">Target: {student?.preparing_for || 'Studies'}</span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1.5 text-xs text-rose-300 hover:text-rose-200 bg-navy-900 hover:bg-navy-800 px-3 py-2 rounded-lg border border-navy-700 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-4 border-t border-navy-800/80 pt-1 pb-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-gold-500 text-navy-950 font-bold shadow'
                      : 'text-slate-300 hover:text-white hover:bg-navy-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Shree Bala Ji Adhyayan Kendra Library • Self Study Reading Room • Cash-Only Desk
      </footer>
    </div>
  );
};
