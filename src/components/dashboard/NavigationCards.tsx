import React from 'react';
import Link from 'next/link';
import { FiBarChart2, FiMinimize } from 'react-icons/fi';

interface NavigationCardProps {
  title: string;
  description: string;
  linkPath: string;
  icon: string;
}

/**
 * Component NavigationCard individuel
 */
function NavigationCard({ title, description, linkPath, icon }: NavigationCardProps) {
  return (
    <Link href={linkPath} className="block h-full">
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <div className="flex items-center mb-4">
          <div className="rounded-full p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            {icon === 'chart' ? (
              <FiBarChart2 size={24} />
            ) : (
              <FiMinimize size={24} />
            )}
          </div>
          <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium">
          Explorer &rarr;
        </div>
      </div>
    </Link>
  );
}

interface NavigationCardsProps {
  data: NavigationCardProps[];
}

/**
 * NavigationCards Component
 * 
 * Affiche des cartes de navigation vers différentes pages d'analyse.
 */
export function NavigationCards({ data }: NavigationCardsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Analyses disponibles
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {data.map((item, index) => (
          <NavigationCard 
            key={index}
            title={item.title}
            description={item.description}
            linkPath={item.linkPath}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}