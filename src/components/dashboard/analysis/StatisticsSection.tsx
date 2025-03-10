import React from 'react';

interface StatItem {
  label: string;
  value: string;
}

interface StatisticsSectionProps {
  title: string;
  stats: StatItem[];
}

/**
 * Composant de section statistiques
 * Affiche une grille de statistiques globales
 */
export function StatisticsSection({ title, stats }: StatisticsSectionProps) {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}