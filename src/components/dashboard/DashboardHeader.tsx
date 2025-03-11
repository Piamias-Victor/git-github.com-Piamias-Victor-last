// src/components/dashboard/DashboardHeader.tsx (version modifiée)
'use client';

import React, { Suspense } from 'react';
import { CurrentDateRange } from '@/components/dashboard/CurrentDateRange';
import { CurrentPharmacies } from '@/components/dashboard/CurrentPharmacies';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showDateRange?: boolean;
  showPharmacies?: boolean;
}

// Composant de fallback pour le DateRange
const DateRangeSkeleton = () => (
  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
);

// Composant de fallback pour les pharmacies
const PharmaciesSkeleton = () => (
  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
);

// Séparation de la partie qui utilise useSearchParams
function HeaderSelectors({ 
  showDateRange, 
  showPharmacies 
}: { 
  showDateRange?: boolean,
  showPharmacies?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {showDateRange && (
        <Suspense fallback={<DateRangeSkeleton />}>
          <CurrentDateRange />
        </Suspense>
      )}
      
      {showPharmacies && (
        <Suspense fallback={<PharmaciesSkeleton />}>
          <CurrentPharmacies />
        </Suspense>
      )}
    </div>
  );
}

export function DashboardHeader({ 
  title, 
  subtitle, 
  showDateRange = true, 
  showPharmacies = true 
}: DashboardHeaderProps) {
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
        
        {/* Affichage de la plage de dates et des pharmacies si demandé */}
        <HeaderSelectors 
          showDateRange={showDateRange} 
          showPharmacies={showPharmacies} 
        />
      </div>
    </div>
  );
}