import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Armchair,
  IndianRupee,
  CalendarCheck,
  FileSpreadsheet,
  History,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Admin } from '../../types/sblms';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const admin = user as Admin;
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Admissions', path: '/admin/admissions', icon: UserPlus },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Seat Map (120)', path: '/admin/seats', icon: Armchair },
    { label: 'Cash Fees', path: '/admin/fees', icon: IndianRupee },
    { label: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { label: 'Reports & Export', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-navy-950 text-white p-4 flex items-center justify-between border-b border-navy-800">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full border border-gold-500" />
          <span className="font-bold text-sm tracking-wide text-white">SBLMS Admin</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-slate-300 hover:text-white p-1"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-navy-950 text-slate-200 border-r border-navy-800 shrink-0 select-none z-40`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-navy-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-gold-500 overflow-hidden bg-navy-900 shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-white text-sm tracking-tight truncate">
              Shree Bala Ji Library
            </h1>
            <p className="text-xs text-gold-400 font-medium">Administration Portal</p>
          </div>
        </div>

        {/* Current Admin Card */}
        <div className="px-4 py-3 mx-3 my-3 bg-navy-900/80 rounded-lg border border-navy-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-xs border border-gold-500/30">
              {admin?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{admin?.full_name || 'Administrator'}</p>
              <div className="flex items-center space-x-1 text-[11px] text-teal-400">
                <ShieldCheck className="w-3 h-3" />
                <span>{admin?.role || 'Super Admin'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500 text-navy-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-navy-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-navy-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded hover:bg-navy-900 transition"
          >
            <Building className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded hover:bg-navy-900 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Desk</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-6 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-navy-100 text-navy-900 rounded-full">
              SBLMS v1.0
            </span>
            <span className="text-xs text-slate-500">
              Shree Bala Ji Adhyayan Kendra Library Management
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-600">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium rounded border border-emerald-200 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Cash-Only System Active</span>
            </span>
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
