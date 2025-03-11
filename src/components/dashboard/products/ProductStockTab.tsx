import React from 'react';
import { Product } from './ProductResultTable';

interface ProductStockTabProps {
  product: Product;
}

/**
 * Onglet de gestion du stock du produit
 */
export function ProductStockTab({ product }: ProductStockTabProps) {
  return (
    <div>
      <div className="h-60 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Graphique d'évolution du stock</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Stock actuel</h4>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{product.stock}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Stock min recommandé</h4>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{Math.round(product.sales * 0.5)}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Stock max recommandé</h4>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{Math.round(product.sales * 1.5)}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Couverture (jours)</h4>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{Math.round(product.stock / (product.sales / 30))}</p>
        </div>
      </div>
    </div>
  );
}