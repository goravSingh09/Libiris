import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { History, ShieldCheck, Loader2, Search } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getAuditLogs(100);
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-navy-950 tracking-tight">
          System Security & Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable tracking of sensitive administrative operations, cash recordings, and seat changes
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-navy-900 mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No audit records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator Admin</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-900">{log.admin_name}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono bg-navy-50 text-navy-800 px-2 py-0.5 rounded text-[10px] font-bold border border-navy-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {log.target_type} {log.target_id ? `(#${log.target_id})` : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{log.ip_address || '127.0.0.1'}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[10px] max-w-xs truncate">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
