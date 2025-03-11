// src/components/dashboard/products/summaries/SalesTrendSummary.tsx
import React from 'react';
import { Product } from '../ProductResultTable';
import { SummaryCard } from './SummaryCard';

interface SalesTrendSummaryProps {
  products: Product[];
}

export function SalesTrendSummary({ products }: SalesTrendSummaryProps) {
  // Simuler des métriques de tendance basées sur le nombre de produits
  // Dans une vraie application, ces chiffres seraient calculés à partir de données réelles
  const highDecline = Math.floor(products.length * 0.12);
  const lowDecline = Math.floor(products.length * 0.21);
  const stable = Math.floor(products.length * 0.35);
  const lowGrowth = Math.floor(products.length * 0.18);
  const highGrowth = Math.floor(products.length * 0.14);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Évolution des ventes
      </h4>
      
      <div className="space-y-3">
        <SummaryCard
          title="Forte baisse"
          description="Baisse > 15% sur 3 mois"
          value={highDecline}
          icon="arrow-down"
          colorScheme="red"
        />
        
        <SummaryCard
          title="Légère baisse"
          description="Baisse entre 5% et 15%"
          value={lowDecline}
          icon="chevron-right"
          colorScheme="amber"
        />
        
        <SummaryCard
          title="Stable"
          description="Variation entre -5% et 5%"
          value={stable}
          icon="grid"
          colorScheme="blue"
        />
        
        <SummaryCard
          title="Légère hausse"
          description="Hausse entre 5% et 15%"
          value={lowGrowth}
          icon="chevron-left"
          colorScheme="emerald"
        />
        
        <SummaryCard
          title="Forte hausse"
          description="Hausse > 15% sur 3 mois"
          value={highGrowth}
          icon="arrow-up"
          colorScheme="green"
        />
      </div>
    </div>
  );
}