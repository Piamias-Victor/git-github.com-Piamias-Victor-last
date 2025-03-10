import React from 'react';
import Link from 'next/link';
import { TopItems } from '@/components/dashboard/analysis/TopItems';
import { useUrlWithDateParams } from '@/utils/navigationUtils';

interface AnalysisCategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonIcon: React.ReactNode;
  buttonText: string;
  linkPath: string;
  topItems: {
    name: string;
    value: string;
    change?: string;
  }[];
  topTitle: string;
  bgColorClass: string;
  textColorClass: string;
}

/**
 * Composant de carte pour catégorie d'analyse
 * Affiche une catégorie d'analyse avec son top 3
 */
export function AnalysisCategoryCard({
  title,
  description,
  icon,
  buttonIcon,
  buttonText,
  linkPath,
  topItems,
  topTitle,
  bgColorClass,
  textColorClass
}: AnalysisCategoryCardProps) {
  const { getUrl } = useUrlWithDateParams();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <div className={`rounded-full p-3 ${bgColorClass} ${textColorClass} mr-3`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      
      <Link 
        href={getUrl(linkPath)}
        className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        {buttonIcon}
        {buttonText}
      </Link>
      
      <TopItems 
        title={topTitle} 
        items={topItems} 
      />
    </div>
  );
}