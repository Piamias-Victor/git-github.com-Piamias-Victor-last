// src/components/dashboard/products/summaries/MarginSummary.tsx
import React from 'react';
import { Product } from '../ProductResultTable';
import { SummaryCard } from './SummaryCard';

interface MarginSummaryProps {
  products: Product[];
}

export function MarginSummary({ products }: MarginSummaryProps) {
  // Calculer les métriques de marge
  const negativeMargins = products.filter(p => parseFloat(p.marginRate) <= 0).length;
  const lowMargins = products.filter(p => {
    const rate = parseFloat(p.marginRate);
    return rate > 0 && rate < 20;
  }).length;
  const goodMargins = products.filter(p => {
    const rate = parseFloat(p.marginRate);
    return rate >= 20 && rate <= 35;
  }).length;
  const excellentMargins = products.filter(p => parseFloat(p.marginRate) > 35).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Synthèse des marges
      </h4>
      
      <div className="space-y-3">
        <SummaryCard
          title="Marges négatives"
          description="Produits à perte"
          value={negativeMargins}
          icon="trending-down"
          colorScheme="red"
        />
        
        <SummaryCard
          title="Faibles marges"
          description="Marges inférieures à 20%"
          value={lowMargins}
          icon="trending-up"
          colorScheme="amber"
        />
        
        <SummaryCard
          title="Bonnes marges"
          description="Marges entre 20% et 35%"
          value={goodMargins}
          icon="arrow-up"
          colorScheme="emerald"
        />
        
        <SummaryCard
          title="Excellentes marges"
          description="Marges supérieures à 35%"
          value={excellentMargins}
          icon="chart-line"
          colorScheme="green"
        />
      </div>
    </div>
  );
}