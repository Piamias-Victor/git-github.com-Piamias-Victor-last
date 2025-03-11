// src/components/dashboard/labs/LabTopRankings.tsx
import React, { useState } from 'react';
import { FiBarChart2, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { Laboratory } from './LabResultTable';

type RankingType = 'sellOut' | 'sellIn' | 'products';

export function LabTopRankings({ laboratories }: { laboratories: Laboratory[] }) {
  const [rankingType, setRankingType] = useState<RankingType>('sellOut');

  if (laboratories.length === 0) return null;

  // Calculer le top 5 en fonction du critère sélectionné
  const getTopLabs = () => {
    const sortedLabs = [...laboratories];
    
    switch (rankingType) {
      case 'sellOut':
        // Trier par sell-out (décroissant)
        sortedLabs.sort((a, b) => b.revenue.sellOut - a.revenue.sellOut);
        break;
      case 'sellIn':
        // Trier par sell-in (décroissant)
        sortedLabs.sort((a, b) => b.revenue.sellIn - a.revenue.sellIn);
        break;
      case 'products':
        // Trier par nombre de produits (décroissant)
        sortedLabs.sort((a, b) => b.products - a.products);
        break;
    }
    
    // Retourner le top 5
    return sortedLabs.slice(0, 5);
  };

  const topLabs = getTopLabs();
  
  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };
  
  // Formater la valeur à afficher en fonction du critère
  const getValueForDisplay = (lab: Laboratory) => {
    switch (rankingType) {
      case 'sellOut':
        return formatCurrency(lab.revenue.sellOut);
      case 'sellIn':
        return formatCurrency(lab.revenue.sellIn);
      case 'products':
        return lab.products.toString();
    }
  };
  
  // Récupérer le titre approprié
  const getRankingTitle = () => {
    switch (rankingType) {
      case 'sellOut': return 'Top 5 - Sell-out';
      case 'sellIn': return 'Top 5 - Sell-in';
      case 'products': return 'Top 5 - Nombre de Produits';
    }
  };
  
  // Récupérer le libellé de colonne approprié
  const getValueLabel = () => {
    switch (rankingType) {
      case 'sellOut': return 'Sell-out (€)';
      case 'sellIn': return 'Sell-in (€)';
      case 'products': return 'Nombre de Produits';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getRankingTitle()}
        </h4>
        
        {/* Onglets pour changer de critère */}
        <div className="flex text-sm">
          <button 
            onClick={() => setRankingType('sellOut')}
            className={`flex items-center px-3 py-1 rounded-l-md ${
              rankingType === 'sellOut' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiBarChart2 className="mr-1" size={14} /> Sell-out
          </button>
          <button 
            onClick={() => setRankingType('sellIn')}
            className={`flex items-center px-3 py-1 ${
              rankingType === 'sellIn' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiTrendingUp className="mr-1" size={14} /> Sell-in
          </button>
          <button 
            onClick={() => setRankingType('products')}
            className={`flex items-center px-3 py-1 rounded-r-md ${
              rankingType === 'products' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiRefreshCw className="mr-1" size={14} /> Produits
          </button>
        </div>
      </div>
      
      {/* Tableau des top laboratoires */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Rang
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Laboratoire
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                {getValueLabel()}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {topLabs.map((lab, index) => (
              <tr key={lab.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium">
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="max-w-xs truncate">
                    <span className="text-sm font-medium text-gray-900 dark:text-white" title={lab.name}>
                      {lab.name}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Croissance : {lab.growth}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getValueForDisplay(lab)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}