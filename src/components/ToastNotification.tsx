import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }: { key?: React.Key; toast: ToastMessage, removeToast: (id: string) => void }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => removeToast(toast.id), 300); // Wait for animation
    }, 4700);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  return (
    <div 
      className={`pointer-events-auto bg-[#121612] border ${toast.type === 'success' ? 'border-green-500' : 'border-green-900/30'} rounded-xl p-3 shadow-2xl flex items-start gap-3 w-80 transform transition-all duration-300 ${isClosing ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
    >
      <div className={`p-2 rounded-lg ${toast.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-black/50 text-slate-300 border border-green-900/30'}`}>
        <Bell className="w-4 h-4 animate-pulse" />
      </div>
      <div className="flex-1 pt-0.5">
        <h4 className="text-sm font-bold text-white leading-none mb-1">{toast.title}</h4>
        <p className="text-[11px] text-slate-400 leading-snug">{toast.message}</p>
      </div>
      <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
