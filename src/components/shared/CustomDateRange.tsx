'use client';

import React from 'react';

interface CustomDateRangeProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: () => void;
}

/**
 * Composant pour sélectionner une plage de dates personnalisée
 */
export function CustomDateRange({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  onApply 
}: CustomDateRangeProps) {
  return (
    <div className="p-3">
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date de début
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date de fin
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
          />
        </div>
        <button
          onClick={onApply}
          className="w-full mt-2 px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}