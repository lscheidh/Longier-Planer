
import React from 'react';
import { ARENA_CONFIGS } from '../constants';
import { ArenaId } from '../types';

interface Props {
  selectedId: ArenaId | null;
  onSelect: (id: ArenaId) => void;
}

export const ArenaSelector: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {ARENA_CONFIGS.map((config) => (
        <button
          key={config.id}
          onClick={() => onSelect(config.id)}
          className={`p-6 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${
            selectedId === config.id
              ? 'border-emerald-600 bg-emerald-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
          }`}
        >
          <span className={`text-sm font-semibold uppercase tracking-wider ${
            selectedId === config.id ? 'text-emerald-700' : 'text-slate-500'
          }`}>
            Arena
          </span>
          <h3 className="text-xl font-bold text-slate-800">{config.name}</h3>
          <p className="text-sm text-slate-500">
            {config.capacity} {config.capacity === 1 ? 'Platz' : 'Plätze'} parallel möglich
          </p>
        </button>
      ))}
    </div>
  );
};
