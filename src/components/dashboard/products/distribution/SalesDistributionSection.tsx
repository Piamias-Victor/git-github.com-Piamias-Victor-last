// src/components/dashboard/products/distribution/SalesDistributionSection.tsx
import React, { useState } from 'react';
import { Product } from '../ProductResultTable';
import { Card } from '@/components/ui/Card';
import { PerformanceMetrics } from './PerformanceMetrics';
import { FiList, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import TopProductsChart from './TopProductsChart';

interface SalesDistributionSectionProps {
  product: Product;
}

export function SalesDistributionSection({ product }: SalesDistributionSectionProps) {
  const [activeTab, setActiveTab] = useState<'category' | 'laboratory'>('category');
  
  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top 5 des Produits
          </h3>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('category')}
              className={`flex items-center px-3 py-1.5 rounded text-sm font-medium ${
                activeTab === 'category' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FiList className="mr-1.5" size={16} /> Par catégorie
            </button>
            <button
              onClick={() => setActiveTab('laboratory')}
              className={`flex items-center px-3 py-1.5 rounded text-sm font-medium ${
                activeTab === 'laboratory' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FiBarChart2 className="mr-1.5" size={16} /> Par laboratoire
            </button>
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="flex items-start">
            <FiRefreshCw className="text-indigo-500 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" size={16} />
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              Ce graphique présente le top 5 des produits {activeTab === 'category' ? 'de la catégorie' : 'du laboratoire'} {activeTab === 'category' ? product.category : product.laboratory} en termes de ventes. Vous pouvez ainsi situer la performance de votre produit par rapport à la concurrence.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <TopProductsChart product={product} type={activeTab} />
          <PerformanceMetrics product={product} />
        </div>
      </div>
    </Card>
  );
}