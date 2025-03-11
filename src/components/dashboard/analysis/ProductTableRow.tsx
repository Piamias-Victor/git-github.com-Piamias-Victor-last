import React from 'react';
import { FiEye, FiTrendingUp, FiPackage, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';
import { useUrlWithDateParams } from '@/utils/navigationUtils';
import { Product } from './ProductResultTable';

interface ProductTableRowProps {
  product: Product;
  viewMode: 'unit' | 'global';
}

/**
 * Composant pour une ligne du tableau de résultats de produits
 */
export function ProductTableRow({ product, viewMode }: ProductTableRowProps) {
  const { getUrl } = useUrlWithDateParams();
  
  // Calculs pour la vue globale
  const globalPrice = parseFloat(product.price) * product.sales;
  const globalMargin = parseFloat(product.margin) * product.sales;
  
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
        {product.ean}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {product.laboratory}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {product.category}
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
        <Link
          href={getUrl(`/dashboard/product/${product.id}`)}
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
          title="Détails"
        >
          <FiEye size={18} className="inline" />
        </Link>
        <Link
          href={getUrl(`/dashboard/product/${product.id}/sales`)}
          className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300"
          title="Historique des ventes"
        >
          <FiTrendingUp size={18} className="inline" />
        </Link>
        <Link
          href={getUrl(`/dashboard/product/${product.id}/stock`)}
          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
          title="Gestion de stock"
        >
          <FiPackage size={18} className="inline" />
        </Link>
        <Link
          href={getUrl(`/dashboard/product/${product.id}/orders`)}
          className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
          title="Commandes"
        >
          <FiBarChart2 size={18} className="inline" />
        </Link>
      </td>
    </tr>
  );
}