import React from 'react';
import { CurrentDateRange } from '@/components/dashboard/CurrentDateRange';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showDateRange?: boolean;
}

/**
 * DashboardHeader Component
 * 
 * En-tête réutilisable pour les pages du tableau de bord.
 * Peut afficher optionnellement la plage de dates sélectionnée.
 */
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
        {showDateRange && (
          <CurrentDateRange />
        )}
      </div>
    </div>
  );
}