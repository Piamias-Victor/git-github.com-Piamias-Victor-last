// src/components/dashboard/labs/LabResultTable.tsx
import React, { useState } from 'react';
import { FiArrowUp, FiArrowDown, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { LabExpandedView } from './LabExpandedView';

export interface Laboratory {
  id: string;
  name: string;
  products: number;
  revenue: number;
  growth: string;
  margin: string;
}

interface LabResultTableProps {
  laboratories: Laboratory[];
}

/**
 * Composant d'affichage des résultats de laboratoires sous forme de tableau
 */
export function LabResultTable({ laboratories }: LabResultTableProps) {
  const [expandedLabId, setExpandedLabId] = useState<string | null>(null);
  
  if (laboratories.length === 0) {
    return null;
  }
  
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };
  
  // Toggle pour ouvrir/fermer les détails d'un laboratoire
  const toggleLabDetails = (labId: string) => {
    setExpandedLabId(expandedLabId === labId ? null : labId);
  };

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Résultats ({laboratories.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Laboratoire
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Produits
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Chiffre d'affaires
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Croissance
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Marge
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {laboratories.map((lab) => (
                <React.Fragment key={lab.id}>
                  <tr className={expandedLabId === lab.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {lab.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {lab.products}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(lab.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`flex items-center justify-end ${lab.growth.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {lab.growth.startsWith('-') ? 
                          <FiArrowDown className="mr-1" size={14} /> : 
                          <FiArrowUp className="mr-1" size={14} />
                        }
                        {lab.growth}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                      {lab.margin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => toggleLabDetails(lab.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50 transition-colors"
                        title={expandedLabId === lab.id ? "Masquer les détails" : "Afficher les détails"}
                      >
                        {expandedLabId === lab.id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                      </button>
                    </td>
                  </tr>
                  {expandedLabId === lab.id && (
                    <tr className="bg-indigo-50 dark:bg-indigo-900/20">
                      <td colSpan={6} className="px-6 py-4">
                        <LabExpandedView laboratory={lab} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}