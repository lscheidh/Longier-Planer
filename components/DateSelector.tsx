
import React from 'react';
import { format, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { getVisibleDates, isDateAvailable } from '../utils/dateUtils';
import { ArenaConfig } from '../types';

interface Props {
  config: ArenaConfig;
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

export const DateSelector: React.FC<Props> = ({ config, selectedDate, onSelect }) => {
  const allDates = getVisibleDates();
  // Filter für verfügbare Tage und Begrenzung auf die nächsten 3
  const availableDates = allDates.filter(d => isDateAvailable(config, d)).slice(0, 3);

  if (availableDates.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 mb-8">
        Keine verfügbaren Tage in naher Zukunft für diese Halle.
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Einen der nächsten 3 Termintage wählen</h3>
      <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide">
        {availableDates.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateKey;
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={`flex-shrink-0 w-24 p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-emerald-400'
              }`}
            >
              <span className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                {format(date, 'EEE', { locale: de })}
              </span>
              <span className="text-lg font-bold">
                {format(date, 'd')}
              </span>
              <span className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                {isToday(date) ? 'Heute' : format(date, 'MMM', { locale: de })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
