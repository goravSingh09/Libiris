import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StudentDashboardData } from '../../types/sblms';
import {
  Armchair,
  IndianRupee,
  CalendarCheck,
  Receipt,
  Download,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve student dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (receiptNum: string) => {
    try {
      await api.downloadReceiptPdf(receiptNum);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
        <p className="font-bold">Error loading dashboard</p>
        <p className="text-xs mt-1">{error}</p>
        <button
          onClick={fetchStudentData}
          className="mt-4 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { student, seat, fee_summary, attendance_summary, recent_receipts } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-navy-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-gold-400 bg-navy-900/80 px-2.5 py-1 rounded-full border border-gold-500/30">
            Enrolled Member
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            Welcome, {student.full_name}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Student ID: <b className="text-gold-400 font-mono">{student.student_id}</b> • Preparing for: <b>{student.preparing_for}</b>
          </p>
        </div>

        <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-3.5 text-center shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Seat</div>
          <div className="text-2xl font-black text-gold-400 mt-0.5">
            {seat.seat_number ? `Seat #${seat.seat_number}` : 'Unallocated'}
          </div>
        </div>
      </div>

      {/* Primary 3 Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Seat Assignment */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reading Hall Desk</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Armchair className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-navy-950">
            {seat.seat_number ? `Desk No. ${seat.seat_number}` : 'Pending Desk'}
          </div>
          <p className="text-xs text-slate-500">
            {seat.seat_number
              ? 'Your dedicated study desk is reserved for all active sessions.'
              : 'Please contact the administration counter to choose your reading desk.'}
          </p>
        </div>

        {/* Card 2: Fee Status & Dues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee & Ledger</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-navy-950">
              ₹{fee_summary.total_outstanding.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">Outstanding</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              fee_summary.fee_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              fee_summary.fee_status === 'Partially Paid' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
              'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {fee_summary.fee_status}
            </span>
            <Link to="/student/fees" className="text-xs text-gold-600 font-bold hover:underline">
              Ledger Details →
            </Link>
          </div>
        </div>

        {/* Card 3: Today's Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Regularity</span>
            <div className="w-8 h-8 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-teal-700">
              {attendance_summary.attendance_rate}%
            </span>
            <span className="text-xs text-slate-400">Overall Rate</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center space-x-1">
            <span>Today's Status:</span>
            <b className={
              attendance_summary.today_status === 'Present' ? 'text-emerald-600' :
              attendance_summary.today_status === 'Absent' ? 'text-rose-600' :
              'text-slate-600'
            }>
              {attendance_summary.today_status}
            </b>
          </div>
        </div>

      </div>

      {/* Recent Cash Payment Receipts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-navy-950 text-base">Your Official Cash Receipts</h3>
          </div>
          <Link to="/student/fees" className="text-xs text-gold-600 font-bold hover:underline">
            View All Receipts
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b">
                <th className="pb-3">Receipt Number</th>
                <th className="pb-3">Billing Month</th>
                <th className="pb-3">Amount Paid</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Download PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent_receipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No cash payments recorded yet.
                  </td>
                </tr>
              ) : (
                recent_receipts.map((rcpt) => (
                  <tr key={rcpt.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-bold text-navy-950">{rcpt.receipt_number}</td>
                    <td className="py-3 text-slate-600">{rcpt.billing_month}</td>
                    <td className="py-3 font-bold text-emerald-600">₹{rcpt.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold text-[10px] border border-teal-200">
                        CASH
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{rcpt.payment_date}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDownload(rcpt.receipt_number)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-bold transition shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
