import React from 'react';
import { Product } from './ProductResultTable';

interface ProductSearchStatsProps {
  products: Product[];
}

/**
 * Composant affichant des statistiques sur les résultats de recherche produit
 */
export function ProductSearchStats({ products }: ProductSearchStatsProps) {
  if (products.length === 0) {
    return null;
  }

  // Calculs statistiques
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0);
  
  // Calcul du CA total et de la marge totale
  const totalRevenue = products.reduce((sum, product) => {
    return sum + (parseFloat(product.price) * product.sales);
  }, 0);
  
  const totalMargin = products.reduce((sum, product) => {
    return sum + (parseFloat(product.margin) * product.sales);
  }, 0);
  
  // Calcul du taux de marge moyen (pondéré par les ventes)
  const averageMarginRate = (totalMargin / totalRevenue) * 100;
  
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-4 p-4">
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
        Synthèse des résultats
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Produits</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{products.length}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Stock total</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalStock}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Ventes totales</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalSales}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">CA Total</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Marge Totale</p>
          <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(totalMargin)}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({averageMarginRate.toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}