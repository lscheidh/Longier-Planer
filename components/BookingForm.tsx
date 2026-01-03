
import React, { useState } from 'react';

interface Props {
  slotLabel: string;
  onBook: (userName: string, horseName: string) => void;
  onCancel: () => void;
}

export const BookingForm: React.FC<Props> = ({ slotLabel, onBook, onCancel }) => {
  const [userName, setUserName] = useState('');
  const [horseName, setHorseName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && horseName.trim()) {
      onBook(userName, horseName);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Termin reservieren</h2>
          <p className="text-slate-500">Gewählter Zeitslot: <span className="text-emerald-600 font-semibold">{slotLabel}</span></p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ihr vollständiger Name</label>
            <input
              autoFocus
              required
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="Vorname Nachname"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name des Pferdes</label>
            <input
              required
              type="text"
              value={horseName}
              onChange={(e) => setHorseName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="Name Ihres Pferdes"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
            >
              Verbindlich buchen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
