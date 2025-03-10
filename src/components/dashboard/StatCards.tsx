import React from 'react';
import { FiBarChart, FiPackage, FiPieChart, FiTrendingUp, FiUsers } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: string;
}

/**
 * Component StatCard individuel
 */
function StatCard({ title, value, change, icon }: StatCardProps) {
  // Sélection de l'icône selon le type fourni
  const renderIcon = () => {
    switch (icon) {
      case 'revenue':
        return <FiBarChart size={24} />;
      case 'margin':
        return <FiTrendingUp size={24} />;
      case 'percentage':
        return <FiPieChart size={24} />;
      case 'products':
        return <FiPackage size={24} />;
      default:
        return <FiUsers size={24} />;
    }
  };
  
  // Détermination de la couleur selon la valeur du changement
  const changeColor = () => {
    if (!change) return "";
    return change.startsWith('+') 
      ? 'text-emerald-600 dark:text-emerald-400' 
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-full p-3 bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
          {renderIcon()}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
              {value}
            </h3>
            {change && (
              <span className={`ml-2 text-sm font-medium ${changeColor()}`}>
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardsProps {
  data: StatCardProps[];
}

/**
 * StatCards Component
 * 
 * Groupe de cartes statistiques affichant les KPIs essentiels.
 */
export function StatCards({ data }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {data.map((stat, index) => (
        <StatCard 
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}