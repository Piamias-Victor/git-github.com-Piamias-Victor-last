import React, { useState } from 'react';
import { FiTrendingUp, FiPackage, FiBarChart2, FiInfo } from 'react-icons/fi';
import { Product } from './ProductResultTable';
import { ProductDetailsTab } from './ProductDetailsTab';
import { ProductSalesTab } from './ProductSalesTab';
import { ProductStockTab } from './ProductStockTab';
import { ProductOrdersTab } from './ProductOrdersTab';

interface ProductExpandedViewProps {
  product: Product;
}

/**
 * Composant affichant les détails étendus d'un produit
 * Avec onglets pour les différentes sections
 */
export function ProductExpandedView({ product }: ProductExpandedViewProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'sales' | 'stock' | 'orders'>('details');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-800/50">
      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeTab === 'details'
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiInfo className="mr-2" size={16} /> Détails
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeTab === 'sales'
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiTrendingUp className="mr-2" size={16} /> Ventes
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeTab === 'stock'
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiPackage className="mr-2" size={16} /> Stock
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeTab === 'orders'
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiBarChart2 className="mr-2" size={16} /> Commandes
        </button>
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'details' && <ProductDetailsTab product={product} />}
        {activeTab === 'sales' && <ProductSalesTab product={product} />}
        {activeTab === 'stock' && <ProductStockTab product={product} />}
        {activeTab === 'orders' && <ProductOrdersTab product={product} />}
      </div>
    </div>
  );
}