import React from 'react';
import { Product } from './ProductResultTable';

interface ProductSalesTabProps {
  product: Product;
}

/**
 * Onglet des ventes du produit
 */
export function ProductSalesTab({ product }: ProductSalesTabProps) {
  return (
    <div>
      <div className="h-60 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Graphique des ventes sur 6 mois</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ventes du mois</h4>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{product.sales}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ventes/mois (moy.)</h4>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{Math.round(product.sales * 0.9)}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tendance</h4>
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">+{Math.round(Math.random() * 10)}%</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Rotation</h4>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{Math.round(product.sales / product.stock * 10) / 10}x</p>
        </div>
      </div>
    </div>
  );
}