import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdminDashboardData } from '../../types/sblms';
import {
  Users,
  Armchair,
  CalendarCheck,
  IndianRupee,
  AlertTriangle,
  UserCheck,
  ArrowUpRight,
  Receipt,
  Download,
  Loader2,
  CheckCircle2,
  PlusCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (receiptNum: string) => {
    try {
      await api.downloadReceiptPdf(receiptNum);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center">
        <p className="font-bold">Error loading dashboard</p>
        <p className="text-xs mt-1">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const { metrics, charts, recent_admissions, recent_receipts } = data;

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            Library Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics and management overview for Shree Bala Ji Library
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/fees"
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Record Cash Payment</span>
          </Link>
          <Link
            to="/admin/attendance"
            className="inline-flex items-center space-x-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Attendance</span>
          </Link>
          <Link
            to="/admin/seats"
            className="inline-flex items-center space-x-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition"
          >
            <Armchair className="w-3.5 h-3.5" />
            <span>Allocate Seats</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <Users className="w-5 h-5 text-navy-800" />
            </div>
          </div>
          <div className="text-3xl font-black text-navy-950">{metrics.total_students}</div>
          <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2">
            <span className="text-emerald-600 font-semibold">{metrics.approved_students} Approved</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{metrics.pending_admissions} Pending</span>
          </div>
        </div>

        {/* Metric 2: Seats */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seat Occupancy</span>
            <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
              <Armchair className="w-5 h-5 text-gold-600" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-navy-950">{metrics.occupied_seats}</span>
            <span className="text-xs text-slate-400">/ {metrics.total_seats} Seats</span>
          </div>
          <div className="flex items-center space-x-2 text-xs mt-2">
            <span className="text-teal-600 font-bold">{metrics.seat_occupancy_rate}% Occupied</span>
            <span className="text-slate-400">({metrics.available_seats} Available)</span>
          </div>
        </div>

        {/* Metric 3: Cash Collected This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cash Collected (Month)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            ₹{metrics.cash_collected_this_month.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Manual Cash-Only Desk</span>
          </div>
        </div>

        {/* Metric 4: Outstanding Fees & Overdue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Dues</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            ₹{metrics.outstanding_fees.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            <span className="text-rose-600 font-semibold">{metrics.overdue_invoices_count} Invoices Overdue</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Cash Collection Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-950 text-sm">Monthly Cash Collections (INR)</h3>
            <span className="text-[11px] font-semibold text-slate-500">Last 6 Months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.collection_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Collected']}
                  contentStyle={{ backgroundColor: '#0B192C', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="collected" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Status Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-navy-950 text-sm mb-4">Invoice Status Breakdown</h3>
          <div className="h-52 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.fee_breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {charts.fee_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [val, 'Invoices']}
                  contentStyle={{ backgroundColor: '#0B192C', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {charts.fee_breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 truncate">{item.name}: <b>{item.count}</b></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activity Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Cash Receipts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-navy-950 text-sm">Recent Cash Receipts</h3>
            </div>
            <Link to="/admin/fees" className="text-xs text-gold-600 hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b text-slate-400 font-semibold">
                  <th className="pb-2">Receipt No</th>
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent_receipts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400">No cash receipts recorded yet.</td>
                  </tr>
                ) : (
                  recent_receipts.map((rcpt) => (
                    <tr key={rcpt.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 font-bold text-navy-900">{rcpt.receipt_number}</td>
                      <td className="py-2.5 font-medium">{rcpt.student_name} <span className="text-slate-400">({rcpt.student_uid})</span></td>
                      <td className="py-2.5 font-bold text-emerald-600">₹{rcpt.amount.toFixed(2)}</td>
                      <td className="py-2.5 text-slate-500">{rcpt.payment_date}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => downloadReceipt(rcpt.receipt_number)}
                          className="p-1 hover:bg-slate-100 text-navy-700 rounded transition"
                          title="Download Receipt PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-navy-800" />
              <h3 className="font-bold text-navy-950 text-sm">Recent Applications</h3>
            </div>
            <Link to="/admin/admissions" className="text-xs text-gold-600 hover:underline font-semibold">
              Manage Admissions
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b text-slate-400 font-semibold">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Student Name</th>
                  <th className="pb-2">Target</th>
                  <th className="pb-2">Seat</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent_admissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400">No student records found.</td>
                  </tr>
                ) : (
                  recent_admissions.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 font-bold text-gold-600">{st.student_id}</td>
                      <td className="py-2.5 font-medium">{st.full_name}</td>
                      <td className="py-2.5 text-slate-500">{st.preparing_for}</td>
                      <td className="py-2.5">{st.seat_number ? `Seat ${st.seat_number}` : '-'}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          st.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                          st.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
