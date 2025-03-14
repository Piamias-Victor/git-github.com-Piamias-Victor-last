// src/components/dashboard/markets/MarketSegmentsGrid.tsx
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { formatCurrency } from '@/utils/marketSegmentData';
import React, { useState } from 'react';
import { FiBarChart2, FiGrid, FiList, FiArrowUp, FiArrowDown, FiChevronRight } from 'react-icons/fi';
import { SegmentCard } from './SegmentCard';
import { SegmentListItem } from './SegmentListItem';


interface MarketSegmentsGridProps {
  segments: MarketSegment[];
  onSegmentSelect: (segment: MarketSegment) => void;
  segmentType: string;
}

export function MarketSegmentsGrid({ 
  segments, 
  onSegmentSelect,
  segmentType
}: MarketSegmentsGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(6);
  
  // Déterminer le libellé du type de segment
  const getSegmentTypeLabel = () => {
    const labels: Record<string, string> = {
      'universe': 'univers',
      'category': 'catégories',
      'sub_category': 'sous-catégories',
      'family': 'familles',
      'sub_family': 'sous-familles',
      'specificity': 'spécificités',
      'lab_distributor': 'distributeurs',
      'brand_lab': 'laboratoires',
      'range_name': 'gammes'
    };
    return labels[segmentType] || 'segments';
  };
  
  // Calculer les statistiques de marché
  const marketStats = {
    totalRevenue: segments.reduce((sum, s) => sum + s.revenue, 0),
    totalProducts: segments.reduce((sum, s) => sum + s.products, 0),
    growingSegments: segments.filter(s => !s.growth.startsWith('-')).length,
    decliningSegments: segments.filter(s => s.growth.startsWith('-')).length
  };
  
  // Afficher plus de segments
  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, segments.length));
  };

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FiBarChart2 className="mr-2" size={20} />
            Segments analysés
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {segments.length} {getSegmentTypeLabel()} au total
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm">
            {formatCurrency(marketStats.totalRevenue)}
          </div>
          
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 flex items-center justify-center ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              aria-label="Vue grille"
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 flex items-center justify-center ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              aria-label="Vue liste"
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Statistiques résumées */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400">Segments</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{segments.length}</div>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400">Produits</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{marketStats.totalProducts}</div>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <FiArrowUp className="text-green-500 mr-1" size={14} />
            En croissance
          </div>
          <div className="text-xl font-semibold text-green-600 dark:text-green-400">{marketStats.growingSegments}</div>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <FiArrowDown className="text-red-500 mr-1" size={14} />
            En baisse
          </div>
          <div className="text-xl font-semibold text-red-600 dark:text-red-400">{marketStats.decliningSegments}</div>
        </div>
      </div>
      
      {/* Vue grille ou liste */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.slice(0, displayCount).map((segment) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              onClick={() => onSegmentSelect(segment)}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg divide-y divide-gray-200 dark:divide-gray-700 border-gray-200 dark:border-gray-700 overflow-hidden">
          {segments.slice(0, displayCount).map((segment) => (
            <SegmentListItem
              key={segment.id}
              segment={segment}
              onClick={() => onSegmentSelect(segment)}
            />
          ))}
        </div>
      )}
      
      {/* Bouton "Voir plus" */}
      {displayCount < segments.length && (
        <div className="mt-5 text-center">
          <button
            onClick={handleShowMore}
            className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
            Voir {Math.min(6, segments.length - displayCount)} segments supplémentaires
            <FiChevronRight className="ml-1" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}