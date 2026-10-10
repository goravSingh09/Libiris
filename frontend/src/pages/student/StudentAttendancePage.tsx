import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types/sblms';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Calendar
} from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const student = user as Student;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.id) {
      fetchAttendance(student.id);
    }
  }, [student]);

  const fetchAttendance = async (studentId: number) => {
    try {
      setLoading(true);
      const res = await api.getStudentAttendance(studentId);
      if (res.success) {
        setData(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
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
          My Study Attendance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Reading hall check-ins and monthly regularity summary
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tracked Days</span>
          <div className="text-2xl font-black text-navy-950 mt-1">{data.total_days_tracked}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Present</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{data.present_days}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Absent</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{data.absent_days}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Regularity Rate</span>
          <div className="text-2xl font-black text-teal-600 mt-1">{data.attendance_rate}%</div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-950 text-base">Attendance Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b">
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Check-in Time</th>
                <th className="pb-3 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No attendance records logged yet.
                  </td>
                </tr>
              ) : (
                data.history.map((h: any) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-medium text-navy-950">{h.date}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                        h.status === 'Present' ? 'bg-emerald-50 text-emerald-700' :
                        h.status === 'Absent' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{h.check_in_time || 'Recorded'}</td>
                    <td className="py-3 text-right text-slate-400">{h.notes || '-'}</td>
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
