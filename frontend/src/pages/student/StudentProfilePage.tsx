import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Student } from '../../types/sblms';
import {
  User,
  Lock,
  Phone,
  Mail,
  Home,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const student = user as Student;

  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (passwordForm.new_password !== passwordForm.confirm) {
      setMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setLoading(true);
      const res = await api.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Password changed successfully.' });
        setPasswordForm({ old_password: '', new_password: '', confirm: '' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Password update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-navy-950 tracking-tight">
          Student Profile & Security
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your enrolled details and manage your account credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 border-b pb-4">
            <div className="w-16 h-16 rounded-2xl bg-navy-900 text-gold-400 font-black text-xl flex items-center justify-center shadow-sm">
              {student?.full_name?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-950">{student?.full_name}</h2>
              <p className="text-xs text-gold-600 font-bold font-mono">{student?.student_id}</p>
              <span className="text-[11px] text-slate-400">Joined: {student?.joining_date || 'Enrolled'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Father's Name</span>
              <b className="text-slate-800">{student?.father_name}</b>
            </div>
            <div>
              <span className="text-slate-400 block">Mother's Name</span>
              <b className="text-slate-800">{student?.mother_name}</b>
            </div>
            <div>
              <span className="text-slate-400 block">Mobile Number</span>
              <b className="text-slate-800">{student?.mobile}</b>
            </div>
            <div>
              <span className="text-slate-400 block">Email Address</span>
              <b className="text-slate-800">{student?.email}</b>
            </div>
            <div>
              <span className="text-slate-400 block">Emergency Contact</span>
              <b className="text-slate-800">{student?.emergency_contact}</b>
            </div>
            <div>
              <span className="text-slate-400 block">Aadhaar (Masked)</span>
              <b className="text-slate-800">{student?.aadhaar_number}</b>
            </div>
            <div>
              <span className="text-slate-400 block">Date of Birth</span>
              <b className="text-slate-800">{student?.dob}</b>
            </div>
            <div>
              <span className="text-slate-400 block">Assigned Desk</span>
              <b className="text-teal-700">{student?.seat_number ? `Seat #${student.seat_number}` : 'Unallocated'}</b>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Residential Address</span>
              <b className="text-slate-800">{student?.address}</b>
            </div>
          </div>
        </div>

        {/* Right Column: Change Password */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3">
            <Lock className="w-4 h-4 text-navy-900" />
            <h3 className="font-bold text-navy-950 text-sm">Change Portal Password</h3>
          </div>

          {msg && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.old_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password (Min 6 chars)</label>
              <input
                type="password"
                required
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
