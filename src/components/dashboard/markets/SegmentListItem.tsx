// src/components/dashboard/markets/SegmentListItem.tsx
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { formatCurrency } from '@/utils/marketSegmentData';
import React from 'react';
import { FiArrowUp, FiArrowDown, FiChevronRight } from 'react-icons/fi';

interface SegmentListItemProps {
  segment: MarketSegment;
  onClick: () => void;
}

export function SegmentListItem({ segment, onClick }: SegmentListItemProps) {
  const isGrowing = !segment.growth.startsWith('-');
  
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group transition-colors"
      onClick={onClick}
    >
      <div className="flex-grow flex items-center pr-4">
        <div className="flex-grow">
          <div className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {segment.name}
          </div>
          
          <div className="flex items-center mt-1 flex-wrap gap-2">
            {segment.parent && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {segment.parent}
              </span>
            )}
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {segment.products} produits
            </span>
            {segment.dominantLab && segment.dominantLab !== 'N/A' && (
              <span className="text-xs px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded">
                {segment.dominantLab}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(segment.revenue)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {segment.marketShare} du marché
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded flex items-center ${
          isGrowing
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
          {isGrowing ? (
            <FiArrowUp className="mr-1" size={14} />
          ) : (
            <FiArrowDown className="mr-1" size={14} />
          )}
          <span className="font-medium">{segment.growth}</span>
        </div>
        </div>
        </div>)}