import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Invoice, Payment, Student } from '../../types/sblms';
import {
  IndianRupee,
  Receipt,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Clock
} from 'lucide-react';

export const StudentFeesPage: React.FC = () => {
  const { user } = useAuth();
  const student = user as Student;

  const [ledger, setLedger] = useState<{
    invoices: Invoice[];
    payments: Payment[];
    total_billed: number;
    total_paid: number;
    total_outstanding: number;
    monthly_fee: number;
    fee_status: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.id) {
      fetchLedger(student.id);
    }
  }, [student]);

  const fetchLedger = async (studentId: number) => {
    try {
      setLoading(true);
      const res = await api.getStudentFeeLedger(studentId);
      if (res.success) {
        setLedger(res);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (receiptNum: string) => {
    try {
      await api.downloadReceiptPdf(receiptNum);
    } catch (e: any) {
      alert(`Receipt download failed: ${e.message}`);
    }
  };

  if (loading || !ledger) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-navy-950 tracking-tight">
          Fee Ledger & Cash Receipts
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete statement of monthly study dues and official physical cash receipts
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Plan</span>
          <div className="text-2xl font-black text-navy-950 mt-1">₹{ledger.monthly_fee.toFixed(2)}</div>
          <span className="text-[11px] text-slate-500">Standard monthly fee</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid (Cash)</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹{ledger.total_paid.toFixed(2)}</div>
          <span className="text-[11px] text-slate-500">Verified received at desk</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding Balance</span>
          <div className="text-2xl font-black text-rose-600 mt-1">₹{ledger.total_outstanding.toFixed(2)}</div>
          <span className="text-[11px] text-slate-500">Pending desk collection</span>
        </div>
      </div>

      {/* Cash Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start space-x-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <b>Desk Payment Procedure:</b> Please present your Student ID (<b>{student?.student_id}</b>) at the front desk when paying cash. The desk operator will commit the transaction to the database and your updated receipt will be instantly available below.
        </div>
      </div>

      {/* Monthly Invoices Statement */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-950 text-base">Monthly Billing Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b">
                <th className="pb-3">Invoice Ref</th>
                <th className="pb-3">Billing Month</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3">Fee Amount</th>
                <th className="pb-3">Paid Amount</th>
                <th className="pb-3">Remaining Balance</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 font-bold text-navy-900">{inv.invoice_number}</td>
                  <td className="py-3 font-medium text-slate-700">{inv.billing_month}</td>
                  <td className="py-3 text-slate-500">{inv.due_date}</td>
                  <td className="py-3 font-semibold">₹{inv.total_amount.toFixed(2)}</td>
                  <td className="py-3 font-semibold text-emerald-600">₹{inv.paid_amount.toFixed(2)}</td>
                  <td className="py-3 font-bold text-rose-600">₹{inv.balance_amount.toFixed(2)}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                      inv.status === 'Partially Paid' ? 'bg-teal-50 text-teal-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Receipts History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-navy-950 text-base">Payment Receipts</h3>
          <span className="text-xs text-slate-400 font-medium">{ledger.payments.length} Payments Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b">
                <th className="pb-3">Receipt Number</th>
                <th className="pb-3">Payment Date</th>
                <th className="pb-3">Billing Month</th>
                <th className="pb-3">Amount Received</th>
                <th className="pb-3">Mode</th>
                <th className="pb-3">Desk Cashier</th>
                <th className="pb-3 text-right">Official PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    No cash payments recorded yet.
                  </td>
                </tr>
              ) : (
                ledger.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-bold text-navy-950">{p.receipt_number}</td>
                    <td className="py-3 text-slate-500">{p.payment_date}</td>
                    <td className="py-3 text-slate-600">{p.billing_month}</td>
                    <td className="py-3 font-bold text-emerald-600">₹{p.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold text-[10px] border border-teal-200">
                        CASH
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{p.recorded_by}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDownload(p.receipt_number)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-bold text-xs transition shadow-sm"
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
