'use client';

import React from 'react';

// Périodes prédéfinies exportées pour être utilisées ailleurs
export const PRESET_RANGES = [
  { label: 'Aujourd\'hui', value: 'today' },
  { label: 'Cette semaine', value: 'thisWeek' },
  { label: 'Ce mois', value: 'thisMonth' },
  { label: 'Les 3 derniers mois', value: 'last3Months' },
  { label: 'Les 6 derniers mois', value: 'last6Months' },
  { label: 'Cette année', value: 'thisYear' },
  { label: 'Personnalisé', value: 'custom' }
];

interface PresetRangeOptionsProps {
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

/**
 * Composant pour afficher les options de plages de dates prédéfinies
 */
export function PresetRangeOptions({ selectedRange, onSelectRange }: PresetRangeOptionsProps) {
  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Période</div>
      <div className="space-y-1">
        {PRESET_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => onSelectRange(range.value)}
            className={`w-full text-left px-2 py-1 text-sm rounded-md ${
              selectedRange === range.value
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}