import React from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiPackage, FiActivity, FiDatabase } from 'react-icons/fi';
import { useUrlWithDateParams } from '@/utils/navigationUtils';

interface ActionItemProps {
  title: string;
  count: number;
  icon: string;
  linkPath: string;
}

/**
 * Component ActionItem individuel
 */
function ActionItem({ title, count, icon, linkPath }: ActionItemProps) {
  const { getUrl } = useUrlWithDateParams();
  
  // Fonction pour rendre l'icône appropriée
  const renderIcon = () => {
    switch (icon) {
      case 'alert':
        return <FiAlertTriangle size={20} />;
      case 'empty':
        return <FiDatabase size={20} />;
      case 'warehouse':
        return <FiPackage size={20} />;
      case 'slow':
        return <FiActivity size={20} />;
      default:
        return <FiAlertTriangle size={20} />;
    }
  };

  return (
    <Link href={getUrl(linkPath)} className="block">
      <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex-shrink-0 rounded-full p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
          {renderIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {count}
          </span>
          <span className="text-gray-500 dark:text-gray-400">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}

interface ActionItemsProps {
  data: ActionItemProps[];
}

/**
 * ActionItems Component
 * 
 * Affiche une liste d'actions à mener basée sur l'analyse des données.
 */
export function ActionItems({ data }: ActionItemsProps) {
  const { getUrl } = useUrlWithDateParams();
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Actions à mener
        </h2>
        <Link 
          href={getUrl("/dashboard/actions")} 
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          Voir toutes les actions
        </Link>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <ActionItem 
            key={index} 
            title={item.title}
            count={item.count}
            icon={item.icon}
            linkPath={item.linkPath}
          />
        ))}
      </div>
    </div>
  );
}