import React, { useEffect, useState } from 'react';
import { toastEvent } from '../utils/notify';

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      const t = { id, ...e.detail };
      setToasts((s) => [...s, t]);
      setTimeout(() => {
        setToasts((s) => s.filter(x => x.id !== id));
      }, e.detail.duration || 4000);
    };
    toastEvent.addEventListener('toast', handler);
    return () => toastEvent.removeEventListener('toast', handler);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg max-w-sm font-bold text-sm ${
          t.type === 'error' ? 'bg-red-600 text-white' : t.type === 'success' ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'
        }`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
