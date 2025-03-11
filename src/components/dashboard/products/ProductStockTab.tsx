// src/components/dashboard/products/ProductStockTab.tsx

import { SummaryMetricCard } from "../metrics/SummaryMetricCard";
import { Product } from "./ProductResultTable";
import { ProductStockChart } from "./ProductStockChart";


interface ProductStockTabProps {
  product: Product;
}

/**
 * Onglet de gestion du stock du produit
 */
export function ProductStockTab({ product }: ProductStockTabProps) {
  // Calcul des métriques de stock
  const minRecommended = Math.round(product.sales * 0.5);
  const maxRecommended = Math.round(product.sales * 1.5);
  const coverageDays = Math.round(product.stock / (product.sales / 30));

  // Définition de la couleur pour la couverture
  let coverageColor = "text-gray-800 dark:text-gray-200";
  if (coverageDays < 15) {
    coverageColor = "text-red-600 dark:text-red-400";
  } else if (coverageDays > 45) {
    coverageColor = "text-amber-600 dark:text-amber-400";
  } else {
    coverageColor = "text-emerald-600 dark:text-emerald-400";
  }

  // Définition des métriques à afficher
  const metrics = [
    { 
      label: "Stock actuel", 
      value: product.stock.toString(),
      valueColor: "text-gray-800 dark:text-gray-200"
    },
    { 
      label: "Stock min recommandé", 
      value: minRecommended.toString(),
      valueColor: "text-gray-800 dark:text-gray-200"
    },
    { 
      label: "Stock max recommandé", 
      value: maxRecommended.toString(),
      valueColor: "text-gray-800 dark:text-gray-200"
    },
    { 
      label: "Couverture (jours)", 
      value: coverageDays.toString(),
      valueColor: coverageColor
    }
  ];

  return (
    <div>
      {/* Intégration du graphique d'évolution du stock */}
      <ProductStockChart productId={product.id} productCode={product.ean} />
      
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