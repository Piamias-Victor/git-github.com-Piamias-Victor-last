// src/components/dashboard/labs/visualization/SegmentStatsCards.tsx
import React from 'react';
import { FiPackage, FiGrid, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { SegmentStats, SegmentType } from './useSegmentData';

interface SegmentStatsCardsProps {
  stats: SegmentStats;
  segmentType: SegmentType;
}

// Mapper le type de segment à un titre lisible
const segmentTitles: Record<SegmentType, string> = {
  'universe': 'Univers',
  'category': 'Catégories',
  'family': 'Familles',
  'range': 'Gammes'
};

// Mapper le type de segment à une icône
const segmentIcons: Record<SegmentType, React.ReactNode> = {
  'universe': <FiGrid size={20} />,
  'category': <FiPackage size={20} />,
  'family': <FiBarChart2 size={20} />,
  'range': <FiPieChart size={20} />
};

export function SegmentStatsCards({ stats, segmentType }: SegmentStatsCardsProps) {
  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 mr-3">
            {segmentIcons[segmentType]}
          </div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {segmentTitles[segmentType]} Distincts
          </h4>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.segmentCount}
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {segmentTitles[segmentType]} trouvés pour les laboratoires sélectionnés
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 mr-3">
            <FiPackage size={20} />
          </div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Produits Totaux
          </h4>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.totalProducts}
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Produits analysés dans les laboratoires sélectionnés
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 mr-3">
            <FiBarChart2 size={20} />
          </div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Premier {segmentTitles[segmentType].slice(0, -1)}
          </h4>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.topSegment.name || "N/A"}
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {stats.topSegment.count} produits 
          ({formatPercentage(stats.topSegment.percentage)})
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mr-3">
            <FiPieChart size={20} />
          </div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Diversité
          </h4>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.totalProducts > 0 
            ? formatPercentage((stats.segmentCount / stats.totalProducts) * 100)
            : "0%"
          }
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Ratio {segmentTitles[segmentType]} / Produits
        </div>
      </div>
    </div>
  );
}