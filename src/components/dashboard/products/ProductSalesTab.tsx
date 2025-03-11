// src/components/dashboard/products/ProductSalesTab.tsx
import React from 'react';
import { SummaryMetricCard } from '../metrics/SummaryMetricCard';
import { Product } from './ProductResultTable';
import { ProductSalesChart } from './ProductSalesChart';


interface ProductSalesTabProps {
  product: Product;
}

/**
 * Onglet des ventes du produit
 */
export function ProductSalesTab({ product }: ProductSalesTabProps) {
  // Calcul des métriques de tendance  
  const trend = Math.round(Math.random() * 10);
  const rotation = Math.round(product.sales / product.stock * 10) / 10;
  
  // Définition des métriques à afficher
  const metrics = [
    { 
      label: "Ventes du mois", 
      value: product.sales.toString(),
      valueColor: "text-gray-800 dark:text-gray-200"
    },
    { 
      label: "Ventes/mois (moy.)", 
      value: Math.round(product.sales * 0.9).toString(),
      valueColor: "text-gray-800 dark:text-gray-200"
    },
    { 
      label: "Tendance", 
      value: `+${trend}%`,
      valueColor: "text-emerald-600 dark:text-emerald-400"
    },
    { 
      label: "Rotation", 
      value: rotation.toString() + "x",
      valueColor: "text-gray-800 dark:text-gray-200"
    }
  ];

  return (
    <div>
      {/* Intégration du graphique d'évolution des ventes */}
      <ProductSalesChart productId={product.id} productCode={product.ean} />
      
      {/* Affichage des métriques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {metrics.map((metric, index) => (
          <SummaryMetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            valueColor={metric.valueColor}
          />
        ))}
      </div>
    </div>
  );
}