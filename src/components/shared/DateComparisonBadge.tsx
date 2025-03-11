// src/components/shared/DateComparisonBadge.tsx
import React from 'react';
import { FiRefreshCw, FiCalendar } from 'react-icons/fi';
import { useDateRange } from '@/providers/DateRangeProvider';
import { formatDateForDisplay } from '@/utils/dateUtils';

/**
 * Badge affichant la période principale et la période de comparaison
 * Utilisé dans les entêtes ou tableaux de bord pour contextualiser les données
 */
export function DateComparisonBadge() {
  const { 
    displayLabel, 
    startDate, 
    endDate, 
    comparisonDisplayLabel, 
    comparisonStartDate, 
    comparisonEndDate 
  } = useDateRange();

  return (
    <div className="inline-flex flex-col p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 rounded-lg text-xs">
      <div className="flex items-center font-medium mb-1">
        <FiCalendar className="mr-1" size={14} /> Périodes analysées :
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center md:mr-3">
          <span className="bg-indigo-100 dark:bg-indigo-800/40 px-2 py-0.5 rounded font-semibold">
            {displayLabel}
          </span>
          <span className="text-gray-500 dark:text-gray-400 mx-1 text-xs italic">
            ({formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)})
          </span>
        </div>
        <div className="flex items-center mt-1 md:mt-0">
          <FiRefreshCw className="mr-1 text-gray-500 dark:text-gray-400" size={12} />
          <span className="bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
            {comparisonDisplayLabel}
          </span>
          <span className="text-gray-500 dark:text-gray-400 mx-1 text-xs italic">
            ({formatDateForDisplay(comparisonStartDate)} - {formatDateForDisplay(comparisonEndDate)})
          </span>
        </div>
      </div>
    </div>
  );
}