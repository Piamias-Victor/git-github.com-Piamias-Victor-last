import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface TopItemProps {
  items: {
    name: string;
    value: string;
    change?: string;
  }[];
  title: string;
}

/**
 * Composant affichant les tops items (produits, laboratoires, marchés)
 */
export function TopItems({ items, title }: TopItemProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">
                {item.name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                {item.value}
              </span>
              {item.change && (
                <span className={`text-xs flex items-center ${
                  item.change.startsWith('+') 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.change.startsWith('+') 
                    ? <FiTrendingUp className="mr-1" size={12} /> 
                    : <FiTrendingDown className="mr-1" size={12} />
                  }
                  {item.change}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}