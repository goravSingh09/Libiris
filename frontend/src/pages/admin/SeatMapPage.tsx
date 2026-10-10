import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SeatMetrics, Student } from '../../types/sblms';
import {
  Armchair,
  Search,
  CheckCircle2,
  XCircle,
  User,
  Filter,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

export const SeatMapPage: React.FC = () => {
  const [seats, setSeats] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<SeatMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'Available' | 'Occupied'>('ALL');
  const [search, setSearch] = useState('');

  // Selected seat for modal action
  const [activeSeat, setActiveSeat] = useState<any | null>(null);

  // Unallocated approved students for assigning
  const [unallocatedStudents, setUnallocatedStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchSeats();
    fetchUnallocatedStudents();
  }, []);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const res = await api.getSeats();
      if (res.success) {
        setSeats(res.data.seats);
        setMetrics(res.data.metrics);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnallocatedStudents = async () => {
    try {
      const res = await api.getStudents({ status: 'Approved', seat_status: 'unallocated' });
      if (res.success) {
        setUnallocatedStudents(res.students);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignSeat = async () => {
    if (!activeSeat || !selectedStudentId) return;
    try {
      setAssigning(true);
      const res = await api.assignSeat(activeSeat.seat_number, Number(selectedStudentId));
      if (res.success) {
        setActiveSeat(null);
        setSelectedStudentId('');
        fetchSeats();
        fetchUnallocatedStudents();
      }
    } catch (err: any) {
      alert(`Seat assignment failed: ${err.message}`);
    } finally {
      setAssigning(false);
    }
  };

  const handleReleaseSeat = async () => {
    if (!activeSeat) return;
    if (!confirm(`Are you sure you want to release Seat ${activeSeat.seat_number}?`)) return;

    try {
      setAssigning(true);
      const res = await api.releaseSeat(activeSeat.seat_number);
      if (res.success) {
        setActiveSeat(null);
        fetchSeats();
        fetchUnallocatedStudents();
      }
    } catch (err: any) {
      alert(`Release failed: ${err.message}`);
    } finally {
      setAssigning(false);
    }
  };

  const filteredSeats = seats.filter((s) => {
    if (filter !== 'ALL' && s.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchNum = s.seat_number.includes(q);
      const matchName = (s.assigned_student_name || '').toLowerCase().includes(q);
      const matchUid = (s.assigned_student_uid || '').toLowerCase().includes(q);
      return matchNum || matchName || matchUid;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            Visual Seat Map (120 Capacity)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual floor grid for reading hall desk allocations
          </p>
        </div>

        {metrics && (
          <div className="flex items-center space-x-3 text-xs bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-1 text-slate-600">
              <span className="font-bold text-navy-950">{metrics.total}</span>
              <span>Total</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1 text-emerald-600 font-bold">
              <span>{metrics.available} Available</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1 text-navy-900 font-bold">
              <span>{metrics.occupied} Occupied</span>
            </div>
            <span>•</span>
            <div className="text-teal-600 font-bold">
              {metrics.occupancy_rate}%
            </div>
          </div>
        )}
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {(['ALL', 'Available', 'Occupied'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                filter === mode
                  ? 'bg-navy-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search seat number or student..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </div>
      </div>

      {/* 120 Seat Grid */}
      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-navy-900 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading floor layout...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {filteredSeats.map((seat) => {
              const isOccupied = seat.status === 'Occupied';
              return (
                <button
                  key={seat.id}
                  onClick={() => setActiveSeat(seat)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between h-24 ${
                    isOccupied
                      ? 'bg-navy-950 text-white border-gold-500/50 shadow-md hover:scale-105'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold opacity-75">#{seat.seat_number}</span>
                    <Armchair className={`w-3.5 h-3.5 ${isOccupied ? 'text-gold-400' : 'text-emerald-600'}`} />
                  </div>

                  <div className="my-auto text-center w-full truncate">
                    {isOccupied ? (
                      <div>
                        <div className="text-[11px] font-bold text-white truncate px-1">
                          {seat.assigned_student_name}
                        </div>
                        <div className="text-[9px] text-gold-400 truncate">
                          {seat.assigned_student_uid}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700">Available</span>
                    )}
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isOccupied ? 'bg-navy-800 text-gold-300' : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {seat.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Seat Inspector / Allocation Modal */}
      {activeSeat && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeSeat.status === 'Occupied' ? 'bg-navy-900 text-gold-400' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Armchair className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-navy-950 text-base">Seat #{activeSeat.seat_number}</h3>
              </div>
              <button onClick={() => setActiveSeat(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeSeat.status === 'Occupied' ? (
              <div className="space-y-4">
                <div className="bg-navy-950 text-white p-4 rounded-2xl border border-navy-800 text-xs space-y-2">
                  <div className="text-gold-400 font-bold uppercase tracking-wider text-[10px]">
                    Current Desk Occupant
                  </div>
                  <div className="text-sm font-black">{activeSeat.assigned_student_name}</div>
                  <div className="text-slate-300">Student ID: <b>{activeSeat.assigned_student_uid}</b></div>
                </div>

                <button
                  onClick={handleReleaseSeat}
                  disabled={assigning}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
                >
                  {assigning ? 'Releasing...' : 'Release Seat (Set Available)'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  This seat is currently empty. Select an approved student without an assigned desk:
                </p>

                {unallocatedStudents.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs">
                    No approved unallocated students currently waiting for a desk.
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Choose Student:
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                      className="w-full p-2.5 border rounded-xl text-xs"
                    >
                      <option value="">-- Select Student --</option>
                      {unallocatedStudents.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.student_id} - {st.full_name} ({st.preparing_for})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleAssignSeat}
                  disabled={!selectedStudentId || assigning}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : `Assign Desk #${activeSeat.seat_number}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
