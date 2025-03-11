// src/components/dashboard/labs/LabTopProducts.tsx
import React, { useState, useMemo } from 'react';
import { FiBarChart2, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { Laboratory } from './LabResultTable';
import { Product } from '../products/ProductResultTable';

type RankingType = 'sales' | 'margin' | 'rotation';

export function LabTopProducts({ 
  laboratories, 
  allProducts 
}: { 
  laboratories: Laboratory[], 
  allProducts: Product[] 
}) {
  const [rankingType, setRankingType] = useState<RankingType>('sales');

  // Grouper les produits par laboratoire
  const productsByLab = useMemo(() => {
    return laboratories.reduce((acc, lab) => {
      const labProducts = allProducts.filter(p => p.laboratory === lab.name);
      acc[lab.name] = labProducts;
      return acc;
    }, {} as Record<string, Product[]>);
  }, [laboratories, allProducts]);

  // Calculer le top 5 pour chaque laboratoire
  const getTopProductsForLab = (products: Product[]) => {
    const sortedProducts = [...products];
    
    switch (rankingType) {
      case 'sales':
        // Trier par nombre de ventes (décroissant)
        sortedProducts.sort((a, b) => b.sales - a.sales);
        break;
      case 'margin':
        // Trier par montant total de marge (décroissant)
        sortedProducts.sort((a, b) => {
          const marginA = parseFloat(a.margin) * a.sales;
          const marginB = parseFloat(b.margin) * b.sales;
          return marginB - marginA;
        });
        break;
      case 'rotation':
        // Trier par taux de rotation (ventes/stock, décroissant)
        sortedProducts.sort((a, b) => {
          const rotationA = a.stock > 0 ? a.sales / a.stock : 0;
          const rotationB = b.stock > 0 ? b.sales / b.stock : 0;
          return rotationB - rotationA;
        });
        break;
    }
    
    // Retourner le top 5
    return sortedProducts.slice(0, 5);
  };
  
  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };
  
  // Formater la valeur à afficher en fonction du critère
  const getValueForDisplay = (product: Product) => {
    switch (rankingType) {
      case 'sales':
        return product.sales.toString();
      case 'margin':
        return formatCurrency(parseFloat(product.margin) * product.sales);
      case 'rotation':
        const rotation = product.stock > 0 ? product.sales / product.stock : 0;
        return rotation.toFixed(1) + 'x';
    }
  };
  
  // Récupérer le titre approprié
  const getRankingTitle = () => {
    switch (rankingType) {
      case 'sales': return 'Top 5 des produits par ventes';
      case 'margin': return 'Top 5 des produits par marge';
      case 'rotation': return 'Top 5 des produits par rotation';
    }
  };
  
  // Récupérer le libellé de colonne approprié
  const getValueLabel = () => {
    switch (rankingType) {
      case 'sales': return 'Ventes';
      case 'margin': return 'Marge totale';
      case 'rotation': return 'Rotation';
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
            onClick={() => setRankingType('sales')}
            className={`flex items-center px-3 py-1 rounded-l-md ${
              rankingType === 'sales' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiBarChart2 className="mr-1" size={14} /> Ventes
          </button>
          <button 
            onClick={() => setRankingType('margin')}
            className={`flex items-center px-3 py-1 ${
              rankingType === 'margin' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiTrendingUp className="mr-1" size={14} /> Marge
          </button>
          <button 
            onClick={() => setRankingType('rotation')}
            className={`flex items-center px-3 py-1 rounded-r-md ${
              rankingType === 'rotation' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiRefreshCw className="mr-1" size={14} /> Rotation
          </button>
        </div>
      </div>
      
      {/* Tableau des top produits par laboratoire */}
      <div className="space-y-6">
        {laboratories.map((lab) => {
          const topProducts = getTopProductsForLab(productsByLab[lab.name] || []);
          
          if (topProducts.length === 0) return null;
          
          return (
            <div key={lab.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {lab.name}
              </h5>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Rang
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Produit
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        {getValueLabel()}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {topProducts.map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="max-w-xs truncate">
                            <span className="text-sm font-medium text-gray-900 dark:text-white" title={product.name}>
                              {product.name}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {product.category}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {getValueForDisplay(product)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}