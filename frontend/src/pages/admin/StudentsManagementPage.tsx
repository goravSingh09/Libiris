import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Student } from '../../types/sblms';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  Phone,
  Mail,
  Calendar,
  Armchair,
  X,
  Check
} from 'lucide-react';

export const StudentsManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit Student Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getStudents({ search: search || undefined, page });
      if (res.success) {
        setStudents(res.students);
        setTotalPages(res.pagination.pages);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (st: Student) => {
    setEditingStudent(st);
    setEditForm({
      full_name: st.full_name,
      father_name: st.father_name,
      mother_name: st.mother_name,
      whatsapp: st.whatsapp,
      emergency_contact: st.emergency_contact,
      address: st.address,
      preparing_for: st.preparing_for,
      monthly_fee: st.monthly_fee,
      status: st.status
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      setSavingEdit(true);
      const res = await api.updateStudent(editingStudent.id, editForm);
      if (res.success) {
        setEditingStudent(null);
        fetchStudents();
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete student '${name}'? This will remove all their records.`)) return;
    try {
      const res = await api.deleteStudent(id);
      if (res.success) {
        fetchStudents();
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            Student Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of enrolled members, desk allocations, and profiles
          </p>
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
          placeholder="Search by student ID, name, email or mobile..."
          className="w-full text-xs sm:text-sm text-navy-950 focus:outline-none"
        />
        <button
          onClick={() => { setPage(1); fetchStudents(); }}
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold px-4 py-2 rounded-xl shrink-0"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-navy-900 mx-auto" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Desk Seat</th>
                  <th className="py-3 px-4">Monthly Fee</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4">Admission</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-gold-600">{st.student_id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-navy-900">{st.full_name}</div>
                      <div className="text-[11px] text-slate-400">Target: {st.preparing_for}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{st.mobile}</div>
                      <div className="text-[11px] text-slate-400">{st.email}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-teal-800">
                      {st.seat_number ? `Seat ${st.seat_number}` : <span className="text-slate-400">None</span>}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">₹{st.monthly_fee}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.fee_status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                        st.fee_status === 'Partially Paid' ? 'bg-teal-50 text-teal-700' :
                        st.fee_status === 'Overdue' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {st.fee_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        st.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(st)}
                        className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(st.id, st.full_name)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-end space-x-2 text-xs">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="py-1 px-2 font-bold text-slate-600">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-navy-950 text-base">Edit Student: {editingStudent.student_id}</h3>
              <button onClick={() => setEditingStudent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.father_name}
                    onChange={(e) => setEditForm({ ...editForm, father_name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.mother_name}
                    onChange={(e) => setEditForm({ ...editForm, mother_name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Fee (INR)</label>
                  <input
                    type="number"
                    value={editForm.monthly_fee}
                    onChange={(e) => setEditForm({ ...editForm, monthly_fee: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Exam / Goal</label>
                <input
                  type="text"
                  value={editForm.preparing_for}
                  onChange={(e) => setEditForm({ ...editForm, preparing_for: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 bg-navy-900 text-white rounded-xl font-bold"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
