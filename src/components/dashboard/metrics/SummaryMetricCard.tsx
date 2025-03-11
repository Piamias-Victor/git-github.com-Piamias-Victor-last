// src/components/dashboard/metrics/SummaryMetricCard.tsx
import React, { ReactNode } from 'react';

interface SummaryMetricCardProps {
  label: string;
  value: string;
  valueColor?: string;
  icon?: ReactNode;
}

/**
 * Composant réutilisable pour afficher une métrique avec étiquette et valeur
 */
export function SummaryMetricCard({ 
  label, 
  value, 
  valueColor = "text-gray-800 dark:text-gray-200",
  icon
}: SummaryMetricCardProps) {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</h4>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}