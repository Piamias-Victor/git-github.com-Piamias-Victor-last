// src/components/dashboard/products/summaries/StockSummary.tsx
import React from 'react';
import { Product } from '../ProductResultTable';
import { SummaryCard } from './SummaryCard';

interface StockSummaryProps {
  products: Product[];
}

export function StockSummary({ products }: StockSummaryProps) {
  // Calculer les métriques de stock
  const criticalStock = products.filter(p => p.stock <= 5).length;
  const watchStock = products.filter(p => p.stock > 5 && p.stock <= 20).length;
  const optimalStock = products.filter(p => p.stock > 20 && p.stock <= 50).length;
  const overStock = products.filter(p => p.stock > 50).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Synthèse des stocks
      </h4>
      
      <div className="space-y-3">
        <SummaryCard
          title="Stocks critiques"
          description="Produits avec moins de 5 unités"
          value={criticalStock}
          icon="alert"
          colorScheme="red"
        />
        
        <SummaryCard
          title="Stocks à surveiller"
          description="Produits avec 6-20 unités"
          value={watchStock}
          icon="alert-circle"
          colorScheme="amber"
        />
        
        <SummaryCard
          title="Stocks optimaux"
          description="Produits avec 21-50 unités"
          value={optimalStock}
          icon="check-circle"
          colorScheme="green"
        />
        
        <SummaryCard
          title="Surstock"
          description="Produits avec plus de 50 unités"
          value={overStock}
          icon="inbox"
          colorScheme="blue"
        />
      </div>
    </div>
  );
}