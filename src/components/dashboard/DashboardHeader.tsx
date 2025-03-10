'use client';

import React, { Suspense } from 'react';
import { CurrentDateRange } from '@/components/dashboard/CurrentDateRange';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showDateRange?: boolean;
}

// Séparez la partie qui pourrait utiliser useSearchParams
function DateRangeWrapper() {
  return (
    <Suspense fallback={<div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>}>
      <CurrentDateRange />
    </Suspense>
  );
}

export function DashboardHeader({ title, subtitle, showDateRange = true }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Affichage de la plage de dates si demandé */}
        {showDateRange && <DateRangeWrapper />}
      </div>
    </div>
  );
}