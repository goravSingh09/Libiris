import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarn = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-700/50 text-emerald-200'
                : isWarn
                ? 'bg-amber-950/90 border-amber-700/50 text-amber-200'
                : 'bg-slate-900/90 border-slate-700/50 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isWarn && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
              {!isSuccess && !isWarn && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
              <span className="text-sm font-medium leading-tight">{toast.text}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
