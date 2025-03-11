// src/components/dashboard/products/summaries/SummaryCard.tsx
import React from 'react';
import { 
  FiAlertTriangle, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiInbox,
  FiTrendingDown,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiBarChart2,
  FiChevronRight,
  FiChevronLeft,
  FiGrid
} from 'react-icons/fi';

type ColorScheme = 'red' | 'amber' | 'emerald' | 'green' | 'blue';
type IconType = 'alert' | 'alert-circle' | 'check-circle' | 'inbox' | 
                'trending-down' | 'trending-up' | 'arrow-up' | 'arrow-down' | 
                'chart-line' | 'chevron-right' | 'chevron-left' | 'grid';

interface SummaryCardProps {
  title: string;
  description: string;
  value: number;
  icon: IconType;
  colorScheme: ColorScheme;
}

export function SummaryCard({ title, description, value, icon, colorScheme }: SummaryCardProps) {
  // Couleurs de fond et texte par schéma de couleur
  const bgColors = {
    red: 'bg-red-50 dark:bg-red-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
  };
  
  const iconBgColors = {
    red: 'bg-red-100 dark:bg-red-900/30',
    amber: 'bg-amber-100 dark:bg-amber-900/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
    green: 'bg-green-100 dark:bg-green-900/30',
    blue: 'bg-blue-100 dark:bg-blue-900/30',
  };
  
  const textColors = {
    red: 'text-red-600 dark:text-red-400',
    amber: 'text-amber-600 dark:text-amber-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
  };

  // Choix de l'icône
  const getIcon = () => {
    switch (icon) {
      case 'alert': return <FiAlertTriangle size={20} />;
      case 'alert-circle': return <FiAlertCircle size={20} />;
      case 'check-circle': return <FiCheckCircle size={20} />;
      case 'inbox': return <FiInbox size={20} />;
      case 'trending-down': return <FiTrendingDown size={20} />;
      case 'trending-up': return <FiTrendingUp size={20} />;
      case 'arrow-up': return <FiArrowUp size={20} />;
      case 'arrow-down': return <FiArrowDown size={20} />;
      case 'chart-line': return <FiBarChart2 size={20} />;
      case 'chevron-right': return <FiChevronRight size={20} />;
      case 'chevron-left': return <FiChevronLeft size={20} />;
      case 'grid': return <FiGrid size={20} />;
      default: return <FiAlertTriangle size={20} />;
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 ${bgColors[colorScheme]} rounded-lg`}>
      <div className="flex items-center">
        <div className={`w-8 h-8 flex items-center justify-center ${iconBgColors[colorScheme]} ${textColors[colorScheme]} rounded-full mr-3`}>
          {getIcon()}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
        </div>
      </div>
      <div className={`text-xl font-bold ${textColors[colorScheme]}`}>
        {value}
      </div>
    </div>
  );
}