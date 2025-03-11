// Modification à apporter à src/components/dashboard/products/ProductExpandedView.tsx
import React from 'react';
import { FiTrendingUp, FiPackage, FiBarChart2, FiInfo, FiGlobe, FiPieChart } from 'react-icons/fi';
import { Product } from './ProductResultTable';
import { ProductDetailsTab } from './ProductDetailsTab';
import { ProductSalesTab } from './ProductSalesTab';
import { ProductStockTab } from './ProductStockTab';
import { ProductOrdersTab } from './ProductOrdersTab';
import { PharmacyComparisonChart } from './comparison/PharmacyComparisonChart'; // Importer le nouveau composant
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { SalesDistributionSection } from './distribution/SalesDistributionSection';

interface ProductExpandedViewProps {
  product: Product;
}

export function ProductExpandedView({ product }: ProductExpandedViewProps) {
  const tabs: TabItem[] = [
    {
      id: 'details',
      label: (
        <div className="flex items-center">
          <FiInfo className="mr-2" size={16} /> Détails
        </div>
      ),
      content: <ProductDetailsTab product={product} />
    },
    {
      id: 'sales',
      label: (
        <div className="flex items-center">
          <FiTrendingUp className="mr-2" size={16} /> Ventes
        </div>
      ),
      content: <ProductSalesTab product={product} />
    },
    {
      id: 'stock',
      label: (
        <div className="flex items-center">
          <FiPackage className="mr-2" size={16} /> Stock
        </div>
      ),
      content: <ProductStockTab product={product} />
    },
    {
      id: 'orders',
      label: (
        <div className="flex items-center">
          <FiBarChart2 className="mr-2" size={16} /> Commandes
        </div>
      ),
      content: <ProductOrdersTab product={product} />
    },
    // Ajouter un nouvel onglet pour la comparaison entre pharmacies
    {
      id: 'comparison',
      label: (
        <div className="flex items-center">
          <FiGlobe className="mr-2" size={16} /> Moyenne groupement
        </div>
      ),
      content: <PharmacyComparisonChart productId={product.id} productCode={product.ean} />
    },
    {
      id: 'distribution',
      label: (
        <div className="flex items-center">
          <FiPieChart className="mr-2" size={16} /> Répartition
        </div>
      ),
      content: <SalesDistributionSection product={product} />
    }
  ];

  return (
    <Card className="border border-indigo-200 dark:border-indigo-800/50">
      <Tabs tabs={tabs} defaultTab="details" />
    </Card>
  );
}