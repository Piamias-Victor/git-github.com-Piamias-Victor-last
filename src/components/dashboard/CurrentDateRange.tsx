import { useDateRange } from '@/providers/DateRangeProvider';
import React from 'react';
import { FiCalendar, FiRefreshCw } from 'react-icons/fi';

/**
 * Composant affichant la plage de dates actuelle et la période de comparaison
 * Utilisé dans les entêtes des pages du dashboard pour rappeler les filtres actifs
 */
export function CurrentDateRange() {
  const { displayLabel, comparisonDisplayLabel } = useDateRange();

  return (
    <div className="inline-flex flex-col sm:flex-row items-start sm:items-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-md text-sm">
      <div className="flex items-center">
        <FiCalendar className="mr-2" size={16} />
        <span className="font-medium">{displayLabel}</span>
      </div>
      
      {comparisonDisplayLabel && (
        <div className="flex items-center mt-1 sm:mt-0 sm:ml-3 sm:pl-3 sm:border-l sm:border-indigo-200 dark:sm:border-indigo-800">
          <FiRefreshCw className="mr-2" size={14} />
          <span className="text-xs">vs <span className="font-medium">{comparisonDisplayLabel}</span></span>
        </div>
      )}
    </div>
  );
}