import { useDateRange } from '@/providers/DateRangeProvider';
import React from 'react';
import { FiCalendar } from 'react-icons/fi';

/**
 * Composant affichant la plage de dates actuelle
 * Utilisé dans les entêtes des pages du dashboard pour rappeler le filtre actif
 */
export function CurrentDateRange() {
  const { displayLabel } = useDateRange();

  return (
    <div className="inline-flex items-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-md text-sm">
      <FiCalendar className="mr-2" size={16} />
      <span>{displayLabel}</span>
    </div>
  );
}