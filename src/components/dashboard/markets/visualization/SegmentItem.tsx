// src/components/dashboard/markets/visualization/SegmentItem.tsx
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { formatCurrency } from '@/utils/marketSegmentData';
import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiGrid } from 'react-icons/fi';


interface SegmentItemProps {
  segment: MarketSegment;
  onClick: () => void;
}

export function SegmentItem({ segment, onClick }: SegmentItemProps) {
  const isGrowing = !segment.growth.startsWith('-');
  
  return (
    <div 
      className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors shadow-sm border border-gray-100 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 mr-2.5">
          <FiGrid size={16} />
        </div>
        <div>
          <span className="font-medium text-gray-900 dark:text-white">
            {segment.name}
          </span>
          {segment.parent && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({segment.parent})
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-right mr-3">
          <div className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(segment.revenue)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
            <span className="mr-1">{segment.products} produits</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
              {segment.marketShare}
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          {isGrowing ? (
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center">
              <FiTrendingUp size={16} />
              <span className="ml-1 text-xs font-medium">{segment.growth}</span>
            </div>
          ) : (
            <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 flex items-center">
              <FiTrendingDown size={16} />
              <span className="ml-1 text-xs font-medium">{segment.growth}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}