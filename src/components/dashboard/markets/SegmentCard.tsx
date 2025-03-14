// src/components/dashboard/markets/SegmentCard.tsx
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { formatCurrency } from '@/utils/marketSegmentData';
import React from 'react';
import { FiArrowUp, FiArrowDown, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface SegmentCardProps {
  segment: MarketSegment;
  onClick: () => void;
}

export function SegmentCard({ segment, onClick }: SegmentCardProps) {
  const isGrowing = !segment.growth.startsWith('-');
  
  return (
    <div 
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="max-w-[70%]">
          <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={segment.name}>
            {segment.name}
          </h4>
          <div className="flex items-center mt-1">
            <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
              {segment.products} produits
            </span>
            {segment.parent && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]" title={segment.parent}>
                {segment.parent}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(segment.revenue)}
          </p>
          <div className={`flex items-center justify-end mt-1 ${
            isGrowing 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {isGrowing ? (
              <FiArrowUp className="mr-1" size={14} />
            ) : (
              <FiArrowDown className="mr-1" size={14} />
            )}
            <p className="text-sm font-medium">
              {segment.growth}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Part:
          </span>
          <span className="ml-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            {segment.marketShare}
          </span>
        </div>
        
        {segment.dominantLab && segment.dominantLab !== 'N/A' && (
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
              Leader:
            </span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 truncate max-w-[120px]" title={segment.dominantLab}>
              {segment.dominantLab}
            </span>
          </div>
        )}
      </div>
      
      {/* Indicateur visuel de tendance */}
      <div className="w-full h-1 mt-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${isGrowing ? 'bg-green-500' : 'bg-red-500'}`} 
          style={{ 
            width: `${Math.min(Math.abs(parseFloat(segment.growth)) * 10, 100)}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        ></div>
      </div>
    </div>
  );
}