import React from 'react';
import { Product } from './ProductResultTable';

interface ProductOrdersTabProps {
  product: Product;
}

/**
 * Onglet des commandes du produit
 */
export function ProductOrdersTab({ product }: ProductOrdersTabProps) {
  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dernières commandes</h3>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Fournisseur</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Quantité</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-3 py-2 text-xs text-gray-800 dark:text-gray-200">05/03/2025</td>
              <td className="px-3 py-2 text-xs text-gray-800 dark:text-gray-200">Alliance Healthcare</td>
              <td className="px-3 py-2 text-xs text-right text-gray-800 dark:text-gray-200">10</td>
              <td className="px-3 py-2 text-xs text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Reçue
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-xs text-gray-800 dark:text-gray-200">15/02/2025</td>
              <td className="px-3 py-2 text-xs text-gray-800 dark:text-gray-200">Cerp</td>
              <td className="px-3 py-2 text-xs text-right text-gray-800 dark:text-gray-200">15</td>
              <td className="px-3 py-2 text-xs text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Reçue
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-xs text-gray-800 dark:text-gray-200">10/01/2025</td>
              <td className="px-3 py-2 text-xs text-gray-800 dark:text-gray-200">Alliance Healthcare</td>
              <td className="px-3 py-2 text-xs text-right text-gray-800 dark:text-gray-200">12</td>
              <td className="px-3 py-2 text-xs text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Reçue
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="text-center">
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Commander ce produit
        </button>
      </div>
    </div>
  );
}