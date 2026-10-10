import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Invoice, Payment } from '../../types/sblms';
import {
  IndianRupee,
  Search,
  PlusCircle,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Loader2,
  Receipt,
  X
} from 'lucide-react';

export const FeeManagementPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Record Cash Payment Modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Reversal Modal
  const [reversalTarget, setReversalTarget] = useState<Payment | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('');
  const [submittingReversal, setSubmittingReversal] = useState(false);

  // Bulk Invoicing Modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [genMonth, setGenMonth] = useState<string>(
    new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );

  useEffect(() => {
    fetchFeeData();
  }, [statusFilter]);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      const [invRes, payRes] = await Promise.all([
        api.getInvoices({ status: statusFilter === 'ALL' ? undefined : statusFilter }),
        api.getPayments()
      ]);
      if (invRes.success) setInvoices(invRes.invoices);
      if (payRes.success) setPayments(payRes.payments);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setCashAmount(inv.balance_amount);
    setNotes('');
    setShowRecordModal(true);
  };

  const handleRecordCash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    if (cashAmount <= 0) {
      alert('Amount must be greater than zero.');
      return;
    }
    if (cashAmount > selectedInvoice.balance_amount) {
      alert(`Amount cannot exceed outstanding balance of ₹${selectedInvoice.balance_amount}`);
      return;
    }

    try {
      setSubmittingPayment(true);
      const res = await api.recordCashPayment({
        invoice_id: selectedInvoice.id,
        amount: Number(cashAmount),
        payment_date: paymentDate,
        notes: notes || 'Desk cash collection'
      });

      if (res.success) {
        setShowRecordModal(false);
        fetchFeeData();
        // Immediately offer download
        if (confirm(`Cash payment recorded successfully!\nReceipt: ${res.receipt_number}\nWould you like to download the official PDF receipt now?`)) {
          api.downloadReceiptPdf(res.receipt_number);
        }
      }
    } catch (err: any) {
      alert(`Payment error: ${err.message}`);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleReversePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalTarget || !reversalReason) return;
    try {
      setSubmittingReversal(true);
      const res = await api.reversePayment(reversalTarget.id, reversalReason);
      if (res.success) {
        setReversalTarget(null);
        setReversalReason('');
        fetchFeeData();
      }
    } catch (err: any) {
      alert(`Reversal error: ${err.message}`);
    } finally {
      setSubmittingReversal(false);
    }
  };

  const handleGenerateInvoices = async () => {
    try {
      const res = await api.generateInvoices(genMonth);
      if (res.success) {
        alert(res.message);
        setShowGenModal(false);
        fetchFeeData();
      }
    } catch (err: any) {
      alert(`Invoice generation error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            Cash-Only Fee Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manual desk cash recording, monthly student billing, and verified PDF receipts
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowGenModal(true)}
            className="inline-flex items-center space-x-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Generate Monthly Billing</span>
          </button>
        </div>
      </div>

      {/* Cash Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start space-x-3 text-xs text-emerald-900">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <b>Strict Cash Policy:</b> Online payment gateways are disabled in this release. All payments are physically collected at the library counter by an authorized administrator and validated against invoice balances before receipt generation.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'invoices'
              ? 'border-navy-900 text-navy-950'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Monthly Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'payments'
              ? 'border-navy-900 text-navy-950'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Receipts & Payment History ({payments.length})
        </button>
      </div>

      {/* Invoices Tab Content */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'Pending', 'Partially Paid', 'Overdue', 'Paid'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  statusFilter === st
                    ? 'bg-navy-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-navy-900 mx-auto" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No invoices found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b">
                      <th className="py-3 px-4">Invoice No</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Billing Month</th>
                      <th className="py-3 px-4">Total Fee</th>
                      <th className="py-3 px-4">Paid</th>
                      <th className="py-3 px-4">Outstanding Balance</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-navy-900">{inv.invoice_number}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{inv.student_name}</span>{' '}
                          <span className="text-slate-400">({inv.student_uid})</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{inv.billing_month}</td>
                        <td className="py-3 px-4 font-semibold">₹{inv.total_amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold">₹{inv.paid_amount.toFixed(2)}</td>
                        <td className="py-3 px-4 font-bold text-rose-600">₹{inv.balance_amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                            inv.status === 'Partially Paid' ? 'bg-teal-50 text-teal-700' :
                            inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {inv.balance_amount > 0 ? (
                            <button
                              onClick={() => handleOpenPayment(inv)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition"
                            >
                              Record Cash
                            </button>
                          ) : (
                            <span className="text-slate-400 font-medium">Cleared</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payments Tab Content */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b">
                  <th className="py-3 px-4">Receipt Number</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Amount Received</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Desk Cashier</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-navy-950">{p.receipt_number}</td>
                    <td className="py-3 px-4 font-semibold">{p.student_name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.billing_month}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">₹{p.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold text-[10px] border border-teal-200">
                        CASH
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{p.payment_date}</td>
                    <td className="py-3 px-4 text-slate-500">{p.recorded_by}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => api.downloadReceiptPdf(p.receipt_number)}
                        className="px-2.5 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-semibold transition"
                        title="Download PDF Receipt"
                      >
                        <Download className="w-3.5 h-3.5 inline mr-1" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => setReversalTarget(p)}
                        className="px-2 py-1 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-lg font-semibold transition"
                        title="Auditable Reversal"
                      >
                        <RotateCcw className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Cash Payment Modal */}
      {showRecordModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Desk Cash Collection</span>
                <h3 className="text-lg font-bold text-navy-950">Record Cash Payment</h3>
              </div>
              <button onClick={() => setShowRecordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border text-xs space-y-1.5">
              <div><b>Student:</b> {selectedInvoice.student_name} ({selectedInvoice.student_uid})</div>
              <div><b>Month:</b> {selectedInvoice.billing_month}</div>
              <div><b>Invoice Total:</b> ₹{selectedInvoice.total_amount.toFixed(2)}</div>
              <div><b>Outstanding Dues:</b> <span className="font-bold text-rose-600">₹{selectedInvoice.balance_amount.toFixed(2)}</span></div>
            </div>

            <form onSubmit={handleRecordCash} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cash Amount Received (INR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={selectedInvoice.balance_amount}
                  required
                  value={cashAmount}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  className="w-full p-3 border rounded-xl text-sm font-bold text-navy-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cashier Remarks / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Received at front desk in cash"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm flex items-center space-x-1"
                >
                  {submittingPayment ? 'Processing...' : 'Confirm Cash Received'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reversal Confirmation Modal */}
      {reversalTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-rose-700 text-base">Reverse Cash Transaction</h3>
            <p className="text-xs text-slate-600">
              You are reversing receipt <b>{reversalTarget.receipt_number}</b> (₹{reversalTarget.amount.toFixed(2)}).
              This action is logged in audit records and restores the invoice balance.
            </p>

            <form onSubmit={handleReversePayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Reversal *</label>
                <textarea
                  required
                  rows={2}
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="e.g. Entered incorrect amount by desk staff"
                  className="w-full p-2.5 border rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReversalTarget(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReversal}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold"
                >
                  {submittingReversal ? 'Reversing...' : 'Execute Reversal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Monthly Invoices Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-navy-950 text-base">Generate Monthly Invoices</h3>
            <p className="text-xs text-slate-600">
              Creates fee obligations for all currently approved students for the chosen month.
            </p>

            <div className="text-xs space-y-2">
              <label className="block font-bold text-slate-700">Billing Month</label>
              <input
                type="text"
                value={genMonth}
                onChange={(e) => setGenMonth(e.target.value)}
                placeholder="e.g. October 2026"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateInvoices}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
              >
                Generate Invoices
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
