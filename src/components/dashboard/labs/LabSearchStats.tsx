// src/components/dashboard/labs/LabSearchStats.tsx
import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface Laboratory {
  id: string;
  name: string;
  products: number;
  revenue: {
    sellOut: number;
    sellIn: number;
  };
  growth: string;
  margin: string;
}

interface LabSearchStatsProps {
  laboratories: Laboratory[];
}

/**
 * Composant affichant des statistiques sur les résultats de recherche de laboratoires
 */
export function LabSearchStats({ laboratories }: LabSearchStatsProps) {
  if (laboratories.length === 0) {
    return null;
  }

  // Calculer les statistiques agrégées
  const totalProducts = laboratories.reduce((sum, lab) => sum + lab.products, 0);
  const totalSellOut = laboratories.reduce((sum, lab) => sum + lab.revenue.sellOut, 0);
  const totalSellIn = laboratories.reduce((sum, lab) => sum + lab.revenue.sellIn, 0);
  
  // Calculer le taux de croissance moyen pondéré par le chiffre d'affaires sell-out
  const weightedGrowth = laboratories.reduce((sum, lab) => {
    const growthValue = parseFloat(lab.growth.replace('%', '').replace('+', ''));
    return sum + (growthValue * lab.revenue.sellOut);
  }, 0) / totalSellOut;
  
  // Calculer la marge moyenne pondérée par le chiffre d'affaires sell-out
  const weightedMargin = laboratories.reduce((sum, lab) => {
    const marginValue = parseFloat(lab.margin.replace('%', ''));
    return sum + (marginValue * lab.revenue.sellOut);
  }, 0) / totalSellOut;
  
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-4 p-4">
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
        Synthèse des résultats
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Laboratoires</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{laboratories.length}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Produits</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalProducts}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">CA Sell-out</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totalSellOut)}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">CA Sell-in</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totalSellIn)}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Performance moyenne</p>
          <div className="flex items-center">
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {weightedMargin.toFixed(1)}%
            </p>
            <span className={`ml-2 text-sm flex items-center ${weightedGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {weightedGrowth >= 0 ? <FiArrowUp className="mr-1" size={14} /> : <FiArrowDown className="mr-1" size={14} />}
              {weightedGrowth >= 0 ? '+' : ''}{weightedGrowth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}