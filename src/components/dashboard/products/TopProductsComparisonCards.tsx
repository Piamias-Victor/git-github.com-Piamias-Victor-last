// src/components/dashboard/labs/comparison/TopProductsComparisonCards.tsx
import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { FiArrowUp, FiArrowDown, FiPackage, FiDollarSign, FiPieChart, FiShoppingCart } from 'react-icons/fi';
import { Laboratory } from '../labs/LabResultTable';
import { Product } from './ProductResultTable';

interface ProductComparisonData {
  productName: string;
  yourQuantity: number;
  avgQuantity: number;
  yourRevenue: number;
  avgRevenue: number;
  yourMargin: number;
  avgMargin: number;
  yourStock: number;
  avgStock: number;
  percentageQuantity: number;
  percentageRevenue: number;
  percentageMargin: number;
  percentageStock: number;
}

interface PerformanceIndicatorProps {
  value: number | string;  // Permettre à la fois number et string
  percentage: number;
  isInverse?: boolean;
}


interface TopProductsComparisonCardsProps {
  laboratory: Laboratory;
  allProducts: Product[];
  isLoading?: boolean;
  error?: string | null;
}

export function TopProductsComparisonCards({
  laboratory,
  allProducts,
  isLoading = false,
  error = null
}: TopProductsComparisonCardsProps) {
  // Filtrer les produits du laboratoire sélectionné
  const labProducts = allProducts.filter(product => product.laboratory === laboratory.name);

  // Calculer les données de comparaison simulées pour les produits du laboratoire
  const calculateProductComparisons = (): ProductComparisonData[] => {
    const topProducts = [...labProducts]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return topProducts.map(product => {
      // Simuler des valeurs moyennes pour le groupement
      const avgFactor = 0.8 + Math.random() * 0.4; // Facteur entre 0.8 et 1.2
      
      const avgQuantity = Math.round(product.sales * avgFactor);
      const avgRevenue = parseFloat(product.price) * avgQuantity;
      const avgMargin = parseFloat(product.margin) * avgQuantity;
      const avgStock = Math.round(product.stock * avgFactor);
      
      // Calculer les pourcentages par rapport à la moyenne
      const yourQuantity = product.sales;
      const yourRevenue = parseFloat(product.price) * product.sales;
      const yourMargin = parseFloat(product.margin) * product.sales;
      const yourStock = product.stock;
      
      const percentageQuantity = avgQuantity > 0 ? Math.round((yourQuantity / avgQuantity) * 100) : 100;
      const percentageRevenue = avgRevenue > 0 ? Math.round((yourRevenue / avgRevenue) * 100) : 100;
      const percentageMargin = avgMargin > 0 ? Math.round((yourMargin / avgMargin) * 100) : 100;
      const percentageStock = avgStock > 0 ? Math.round((yourStock / avgStock) * 100) : 100;
      
      return {
        productName: product.name,
        yourQuantity,
        avgQuantity,
        yourRevenue,
        avgRevenue,
        yourMargin,
        avgMargin,
        yourStock,
        avgStock,
        percentageQuantity,
        percentageRevenue,
        percentageMargin,
        percentageStock
      };
    });
  };

  // Obtenir les données de comparaison
  const productComparisons = calculateProductComparisons();

  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  // Gérer les états de chargement et d'erreur
  if (isLoading) return <LoadingState height="60" message="Chargement des données de comparaison de produits..." />;
  if (error) return <ErrorState message={error} />;
  if (labProducts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun produit trouvé pour ce laboratoire
      </div>
    );
  }

  // Composant pour l'indicateur de performance
  const PerformanceIndicator = ({ 
    value, 
    percentage, 
    isInverse = false 
  }: PerformanceIndicatorProps) => {
    const isPositive = isInverse ? percentage <= 100 : percentage >= 100;
    const Icon = isPositive ? FiArrowUp : FiArrowDown;
    
    return (
      <div className="flex flex-col items-end">
        <div className="text-right font-semibold text-gray-900 dark:text-white">{value}</div>
        <div className={`flex items-center text-sm ${
          isPositive 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          <Icon className="mr-1" size={14} />
          <span>{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Top 5 produits {laboratory.name} - Comparaison avec le groupement
      </h3>

      <div className="space-y-4">
        {productComparisons.map((product, index) => (
          <div 
            key={index} 
            className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <h4 className="ml-3 font-semibold text-gray-900 dark:text-white text-base">
                  {product.productName.length > 40 
                    ? product.productName.substring(0, 40) + '...' 
                    : product.productName}
                </h4>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                Moyenne: {product.avgQuantity} ventes
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {/* Ventes */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                    <FiShoppingCart size={18} />
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Ventes</div>
                </div>
                <PerformanceIndicator 
                  value={product.yourQuantity} 
                  percentage={product.percentageQuantity} 
                />
              </div>

              {/* CA */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                    <FiDollarSign size={18} />
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">CA</div>
                </div>
                <PerformanceIndicator 
                  value={formatCurrency(product.yourRevenue)} 
                  percentage={product.percentageRevenue} 
                />
              </div>

              {/* Marge */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center">
                    <FiPieChart size={18} />
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Marge</div>
                </div>
                <PerformanceIndicator 
                  value={formatCurrency(product.yourMargin)} 
                  percentage={product.percentageMargin} 
                />
              </div>

              {/* Stock */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                    <FiPackage size={18} />
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Stock</div>
                </div>
                <PerformanceIndicator 
                  value={product.yourStock} 
                  percentage={product.percentageStock} 
                  isInverse={true} 
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center text-sm">
              <div className="text-gray-500 dark:text-gray-400">
                Moyenne groupement: <span className="font-medium">{formatCurrency(product.avgRevenue)}</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Moyenne marge: <span className="font-medium">{formatCurrency(product.avgMargin)}</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Moyenne stock: <span className="font-medium">{product.avgStock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-3">
            <span className="font-semibold">Note :</span> Les pourcentages indiquent votre performance par rapport à la moyenne du groupement.
            Pour les ventes, CA et marge, des valeurs au-dessus de 100% indiquent une surperformance.
            Pour le stock, des valeurs en-dessous de 100% indiquent une meilleure gestion des stocks.
          </p>
        </div>
      </div>
    </div>
  );
}