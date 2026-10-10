import React, { useState } from 'react';
import { api } from '../../services/api';
import {
  FileSpreadsheet,
  Download,
  Users,
  IndianRupee,
  AlertTriangle,
  CalendarCheck,
  Calendar,
  ShieldAlert
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: 'students' | 'cash-collections' | 'dues' | 'attendance') => {
    try {
      setDownloading(type);
      const params: Record<string, string> = {};
      if (dateRange.start_date) params.start_date = dateRange.start_date;
      if (dateRange.end_date) params.end_date = dateRange.end_date;

      await api.downloadReport(type, params);
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const reportsList = [
    {
      id: 'students' as const,
      title: 'Student Master Directory Export',
      desc: 'Complete roster of students, parent contacts, mobile numbers, assigned desks, and fee status. Sensitive Aadhaar details are masked by default.',
      icon: Users,
      color: 'bg-navy-900 text-white'
    },
    {
      id: 'cash-collections' as const,
      title: 'Cash Fee Collections Report',
      desc: 'Chronological log of cash receipts recorded physically at the library desk, including cashier names, billing months, and receipt numbers.',
      icon: IndianRupee,
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'dues' as const,
      title: 'Fee Dues & Defaulters Report',
      desc: 'List of all active students with pending or overdue fee balances for the current or previous months.',
      icon: AlertTriangle,
      color: 'bg-amber-600 text-white'
    },
    {
      id: 'attendance' as const,
      title: 'Daily Attendance Report',
      desc: 'Detailed log of student presence, absence, leaves, and arrival timestamps for study hall auditing.',
      icon: CalendarCheck,
      color: 'bg-teal-600 text-white'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-navy-950 tracking-tight">
          Reports & CSV Data Exports
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate audit-ready spreadsheets and official financial records for library administration
        </p>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-bold">Date Range Filter (Optional):</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500">From:</span>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              className="p-1.5 border rounded-lg text-xs"
            />
          </div>
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500">To:</span>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              className="p-1.5 border rounded-lg text-xs"
            />
          </div>
          {(dateRange.start_date || dateRange.end_date) && (
            <button
              onClick={() => setDateRange({ start_date: '', end_date: '' })}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          const isDownloading = downloading === rep.id;
          return (
            <div
              key={rep.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-2xl ${rep.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-navy-950 text-sm">{rep.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{rep.desc}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CSV Format</span>
                <button
                  onClick={() => handleDownload(rep.id)}
                  disabled={isDownloading}
                  className="inline-flex items-center space-x-1.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'Generating...' : 'Download CSV'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Notice */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <b>Data Protection:</b> Exports are strictly accessible only by authorized administrators. Student identification numbers and financial transactions are preserved exactly from persistent storage.
        </span>
      </div>

    </div>
  );
};
