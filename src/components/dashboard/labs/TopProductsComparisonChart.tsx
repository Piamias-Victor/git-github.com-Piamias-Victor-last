// src/components/dashboard/labs/comparison/TopProductsComparisonChart.tsx
import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { Product } from '../products/ProductResultTable';
import { Laboratory } from './LabResultTable';

interface ProductComparisonData {
  productName: string;
  yourQuantity: number; // Quantité vendue par notre pharmacie
  avgQuantity: number;  // Quantité moyenne vendue dans le groupement
  yourRevenue: number;  // CA pour notre pharmacie
  avgRevenue: number;   // CA moyen dans le groupement
  yourMargin: number;   // Marge pour notre pharmacie
  avgMargin: number;    // Marge moyenne dans le groupement
  yourStock: number;    // Stock de notre pharmacie
  avgStock: number;     // Stock moyen dans le groupement
  percentageQuantity: number; // % par rapport à la moyenne (ventes)
  percentageRevenue: number;  // % par rapport à la moyenne (CA)
  percentageMargin: number;   // % par rapport à la moyenne (marge)
  percentageStock: number;    // % par rapport à la moyenne (stock)
}

interface TopProductsComparisonProps {
  laboratory: Laboratory;
  allProducts: Product[];
  isLoading?: boolean;
  error?: string | null;
}

export function TopProductsComparisonChart({
  laboratory,
  allProducts,
  isLoading = false,
  error = null
}: TopProductsComparisonProps) {
  // Filtrer les produits du laboratoire sélectionné
  const labProducts = allProducts.filter(product => product.laboratory === laboratory.name);

  // Calculer les données de comparaison simulées pour les produits du laboratoire
  const calculateProductComparisons = (): ProductComparisonData[] => {
    // D'abord, trouver les top 5 produits par ventes
    const topProducts = [...labProducts]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Générer les données de comparaison pour chaque produit
    return topProducts.map(product => {
      // Simuler des valeurs moyennes pour le groupement (légèrement différentes)
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top 5 produits {laboratory.name} - Comparaison avec le groupement
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Produit
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Vos ventes
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                % moyenne
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Votre CA
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                % moyenne
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Votre marge
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                % moyenne
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Votre stock
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                % moyenne
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {productComparisons.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div className="max-w-xs truncate" title={product.productName}>
                    {product.productName}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {product.yourQuantity}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-medium ${
                    product.percentageQuantity >= 100 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.percentageQuantity}%
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {formatCurrency(product.yourRevenue)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-medium ${
                    product.percentageRevenue >= 100 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.percentageRevenue}%
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {formatCurrency(product.yourMargin)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-medium ${
                    product.percentageMargin >= 100 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.percentageMargin}%
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {product.yourStock}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-medium ${
                    product.percentageStock <= 100 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {product.percentageStock}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
        <p>
          <span className="font-medium">Note :</span> Les pourcentages indiquent la performance par rapport à la moyenne du groupement.
          Pour les ventes, CA et marge, des valeurs au-dessus de 100% indiquent une surperformance.
          Pour le stock, des valeurs en-dessous de 100% indiquent une meilleure gestion des stocks.
        </p>
      </div>
    </div>
  );
}