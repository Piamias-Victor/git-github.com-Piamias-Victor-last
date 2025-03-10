import React from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * DashboardHeader Component
 * 
 * En-tête réutilisable pour les pages du tableau de bord.
 */
export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}