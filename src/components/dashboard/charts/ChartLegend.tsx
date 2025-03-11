// src/components/dashboard/charts/ChartLegend.tsx
import React from 'react';

interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
}

interface ChartLegendProps {
  series: ChartSeries[];
}

/**
 * Composant de légende personnalisée pour les graphiques
 * Affiche une liste de séries avec leur couleur et nom
 */
export function ChartLegend({ series }: ChartLegendProps) {
  return (
    <div className="flex space-x-4 text-xs">
      {series.map(serie => (
        <div key={serie.dataKey} className="flex items-center">
          <span 
            className="w-3 h-3 rounded-full inline-block mr-1" 
            style={{ backgroundColor: serie.color }}
          ></span>
          <span className="text-gray-600 dark:text-gray-300">{serie.name}</span>
        </div>
      ))}
    </div>
  );
}