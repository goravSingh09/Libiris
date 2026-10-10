import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DailyAttendanceSummary } from '../../types/sblms';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AttendanceManagementPage: React.FC = () => {
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [data, setData] = useState<DailyAttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state of statuses: { [student_id]: { status, check_in_time } }
  const [attendanceState, setAttendanceState] = useState<Record<number, { status: string; check_in_time: string }>>({});

  useEffect(() => {
    fetchAttendance();
  }, [targetDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.getDailyAttendance(targetDate);
      if (res.success) {
        setData(res.data);
        const map: Record<number, { status: string; check_in_time: string }> = {};
        res.data.students.forEach((st) => {
          map[st.student_id] = {
            status: st.status === 'Unmarked' ? 'Present' : st.status,
            check_in_time: st.check_in_time || '08:00 AM'
          };
        });
        setAttendanceState(map);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: number, status: 'Present' | 'Absent' | 'Leave') => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleMarkAllPresent = () => {
    if (!data) return;
    const map: Record<number, { status: string; check_in_time: string }> = {};
    data.students.forEach((st) => {
      map[st.student_id] = {
        status: 'Present',
        check_in_time: attendanceState[st.student_id]?.check_in_time || '08:00 AM'
      };
    });
    setAttendanceState(map);
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      const entries = Object.entries(attendanceState).map(([id, val]) => ({
        student_id: Number(id),
        status: val.status,
        check_in_time: val.check_in_time
      }));

      const res = await api.bulkMarkAttendance(entries, targetDate);
      if (res.success) {
        alert(res.message);
        fetchAttendance();
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Date Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            Daily Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track reading hall check-ins, record absences, and analyze student regularity
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="text-xs font-bold text-navy-950 focus:outline-none"
            />
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="text-xs font-bold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          >
            Mark All Present
          </button>

          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Records'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Enrolled</div>
            <div className="text-xl font-black text-navy-950 mt-1">{data.total_approved}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Present Today</div>
            <div className="text-xl font-black text-emerald-600 mt-1">{data.present}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-rose-600 text-[10px] font-bold uppercase tracking-wider">Absent</div>
            <div className="text-xl font-black text-rose-600 mt-1">{data.absent}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-amber-600 text-[10px] font-bold uppercase tracking-wider">On Leave</div>
            <div className="text-xl font-black text-amber-600 mt-1">{data.leave}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
            <div className="text-teal-600 text-[10px] font-bold uppercase tracking-wider">Attendance Rate</div>
            <div className="text-xl font-black text-teal-600 mt-1">{data.attendance_rate}%</div>
          </div>
        </div>
      )}

      {/* Bulk Attendance Marking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-navy-900 mx-auto" />
          </div>
        ) : !data || data.students.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No approved active students found for attendance recording.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Desk Seat</th>
                  <th className="py-3 px-4">Check-in Time</th>
                  <th className="py-3 px-4 text-center">Status Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.students.map((st) => {
                  const currentStatus = attendanceState[st.student_id]?.status || 'Present';
                  const checkIn = attendanceState[st.student_id]?.check_in_time || '08:00 AM';

                  return (
                    <tr key={st.student_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-gold-600">{st.student_uid}</td>
                      <td className="py-3 px-4 font-semibold text-navy-950">{st.full_name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {st.seat_number ? `Seat ${st.seat_number}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={checkIn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAttendanceState((prev) => ({
                              ...prev,
                              [st.student_id]: { ...prev[st.student_id], check_in_time: val }
                            }));
                          }}
                          className="w-24 px-2 py-1 border rounded text-[11px] text-slate-700"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-xs">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.student_id, 'Present')}
                            className={`px-3 py-1 font-bold transition ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.student_id, 'Absent')}
                            className={`px-3 py-1 font-bold transition ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.student_id, 'Leave')}
                            className={`px-3 py-1 font-bold transition ${
                              currentStatus === 'Leave'
                                ? 'bg-amber-500 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
