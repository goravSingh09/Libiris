import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Student } from '../../types/sblms';
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Armchair,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  X
} from 'lucide-react';

export const AdmissionsManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('Pending Approval');
  const [search, setSearch] = useState('');

  // Selected student for detail review
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Approval modal state
  const [approveModalStudent, setApproveModalStudent] = useState<Student | null>(null);
  const [approveForm, setApproveForm] = useState({ seat_number: '', monthly_fee: 500 });
  const [submittingApproval, setSubmittingApproval] = useState(false);

  // Reject modal state
  const [rejectModalStudent, setRejectModalStudent] = useState<Student | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Available seats for allocation dropdown
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
    fetchAvailableSeats();
  }, [filterStatus]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getStudents({
        status: filterStatus === 'ALL' ? undefined : filterStatus,
        search: search || undefined
      });
      if (res.success) {
        setStudents(res.students);
      }
    } catch (err: any) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSeats = async () => {
    try {
      const res = await api.getSeats();
      if (res.success) {
        const avail = res.data.seats
          .filter((s: any) => s.status === 'Available')
          .map((s: any) => s.seat_number);
        setAvailableSeats(avail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async () => {
    if (!approveModalStudent) return;
    try {
      setSubmittingApproval(true);
      const res = await api.approveStudent(approveModalStudent.id, {
        seat_number: approveForm.seat_number || undefined,
        monthly_fee: Number(approveForm.monthly_fee)
      });
      if (res.success) {
        setApproveModalStudent(null);
        fetchStudents();
        fetchAvailableSeats();
      }
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setSubmittingApproval(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModalStudent) return;
    try {
      const res = await api.rejectStudent(rejectModalStudent.id, rejectReason);
      if (res.success) {
        setRejectModalStudent(null);
        setRejectReason('');
        fetchStudents();
      }
    } catch (err: any) {
      alert(`Rejection error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            Admissions Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review online student applications, verify identity documents, and grant seat approvals
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['Pending Approval', 'Approved', 'Rejected', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition ${
                filterStatus === st
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
          placeholder="Search by student name, ID, or phone number..."
          className="w-full text-xs sm:text-sm text-navy-950 focus:outline-none"
        />
        <button
          onClick={fetchStudents}
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold px-4 py-2 rounded-xl shrink-0"
        >
          Search
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-navy-900 mx-auto" />
            <p className="text-xs text-slate-500 mt-2">Loading applications...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No admission records found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Mobile & WhatsApp</th>
                  <th className="py-3 px-4">Goal / Exam</th>
                  <th className="py-3 px-4">Seat</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-gold-600">{st.student_id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-navy-900">{st.full_name}</div>
                      <div className="text-[11px] text-slate-400">Father: {st.father_name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{st.mobile}</div>
                      <div className="text-[11px] text-slate-400">{st.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{st.preparing_for}</td>
                    <td className="py-3 px-4">
                      {st.seat_number ? (
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Seat {st.seat_number}
                        </span>
                      ) : (
                        <span className="text-slate-400">Unallocated</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        st.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                        title="View Full Application"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        <span>View</span>
                      </button>

                      {st.status === 'Pending Approval' && (
                        <>
                          <button
                            onClick={() => {
                              setApproveModalStudent(st);
                              setApproveForm({ seat_number: '', monthly_fee: st.monthly_fee || 500 });
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
                            title="Approve Student"
                          >
                            <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectModalStudent(st)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-semibold transition"
                            title="Reject Application"
                          >
                            <XCircle className="w-3.5 h-3.5 inline mr-1" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-xs font-bold text-gold-600">{selectedStudent.student_id}</span>
                <h3 className="text-xl font-bold text-navy-950">{selectedStudent.full_name}</h3>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><b>Father's Name:</b> {selectedStudent.father_name}</div>
              <div><b>Mother's Name:</b> {selectedStudent.mother_name}</div>
              <div><b>Date of Birth:</b> {selectedStudent.dob}</div>
              <div><b>Gender:</b> {selectedStudent.gender}</div>
              <div><b>Mobile:</b> {selectedStudent.mobile}</div>
              <div><b>WhatsApp:</b> {selectedStudent.whatsapp}</div>
              <div><b>Emergency Contact:</b> {selectedStudent.emergency_contact}</div>
              <div><b>Aadhaar Number:</b> {selectedStudent.aadhaar_number}</div>
              <div className="col-span-2"><b>Residential Address:</b> {selectedStudent.address}</div>
              <div><b>Target Preparation:</b> {selectedStudent.preparing_for}</div>
              <div><b>Assigned Seat:</b> {selectedStudent.seat_number || 'None'}</div>
              <div><b>Monthly Fee:</b> ₹{selectedStudent.monthly_fee}</div>
              <div><b>Fee Status:</b> {selectedStudent.fee_status}</div>
            </div>

            {/* Document Previews */}
            <div className="border-t pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Confidential Documents</h4>
              <div className="flex gap-4">
                <a
                  href={api.getDocumentUrl(selectedStudent.id, 'photo')}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4 text-gold-600" />
                  <span>View Student Photo</span>
                </a>
                <a
                  href={api.getDocumentUrl(selectedStudent.id, 'aadhaar')}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4 text-gold-600" />
                  <span>View Aadhaar Document</span>
                </a>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Admission Modal */}
      {approveModalStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-navy-950 text-base">Approve Student Admission</h3>
            <p className="text-xs text-slate-500">
              Granting approval will activate {approveModalStudent.full_name}'s account, assign their seat, and generate the initial monthly invoice.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Seat Number (Available Seats)</label>
                <select
                  value={approveForm.seat_number}
                  onChange={(e) => setApproveForm({ ...approveForm, seat_number: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="">-- Assign Later --</option>
                  {availableSeats.map((s) => (
                    <option key={s} value={s}>Seat {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Fee (INR)</label>
                <input
                  type="number"
                  value={approveForm.monthly_fee}
                  onChange={(e) => setApproveForm({ ...approveForm, monthly_fee: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                onClick={() => setApproveModalStudent(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={submittingApproval}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                {submittingApproval ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Admission Modal */}
      {rejectModalStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-rose-700 text-base">Reject Student Admission</h3>
            <p className="text-xs text-slate-500">
              Please specify the reason for rejecting {rejectModalStudent.full_name}'s application.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete address or unreadable Aadhaar scan..."
              className="w-full p-2.5 border rounded-xl text-xs"
            ></textarea>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectModalStudent(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Reject Admission
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
