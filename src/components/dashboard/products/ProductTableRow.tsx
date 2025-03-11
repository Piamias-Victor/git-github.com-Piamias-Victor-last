import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Product } from './ProductResultTable';
import { ProductExpandedView } from './ProductExpandedView';

interface ProductTableRowProps {
  product: Product;
  viewMode: 'unit' | 'global';
}

/**
 * Composant pour une ligne du tableau de résultats de produits
 * Avec fonctionnalité d'expansion pour voir les détails
 */
export function ProductTableRow({ product, viewMode }: ProductTableRowProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Calculs pour la vue globale
  const globalPrice = parseFloat(product.price) * product.sales;
  const globalMargin = parseFloat(product.margin) * product.sales;
  
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <>
      <tr className={`${expanded ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
          {product.ean}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
          {product.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          {product.laboratory}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 20 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
              : product.stock > 5 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {product.stock}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
          {viewMode === 'unit' 
            ? `${product.price} €` 
            : `${formatCurrency(globalPrice)} €`
          }
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
          {viewMode === 'unit' 
            ? `${product.margin} €` 
            : `${formatCurrency(globalMargin)} €`
          }
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
          <span className={Number(product.marginRate.replace('%', '')) > 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'}>
            {product.marginRate}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
          {product.sales}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center p-1.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50 transition-colors"
            title={expanded ? "Masquer les détails" : "Afficher les détails"}
          >
            {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-indigo-50 dark:bg-indigo-900/20">
          <td colSpan={9} className="px-6 py-4">
            <ProductExpandedView product={product} />
          </td>
        </tr>
      )}
    </>
  );
}