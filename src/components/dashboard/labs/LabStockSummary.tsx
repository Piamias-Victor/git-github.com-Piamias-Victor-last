// src/components/dashboard/labs/LabStockSummary.tsx
import React, { useState, useMemo } from 'react';
import { Laboratory } from './LabResultTable';
import { Product } from '../products/ProductResultTable';
import { SummaryCard } from '../products/summaries/SummaryCard';
import { ProductFilterModal } from '../products/summaries/ProductFilterModal';

interface LabStockSummaryProps {
  laboratories: Laboratory[];
  allProducts: Product[];
}

export function LabStockSummary({ 
  laboratories, 
  allProducts 
}: LabStockSummaryProps) {
  // État pour la modal de filtrage
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterTitle, setFilterTitle] = useState('');

  // Grouper les produits par laboratoire
  const productsByLab = useMemo(() => {
    return laboratories.reduce((acc, lab) => {
      const labProducts = allProducts.filter(p => p.laboratory === lab.name);
      acc[lab.name] = labProducts;
      return acc;
    }, {} as Record<string, Product[]>);
  }, [laboratories, allProducts]);

  // Calculer les métriques de stock par laboratoire
  const stockMetrics = useMemo(() => {
    return laboratories.map(lab => {
      const labProducts = productsByLab[lab.name] || [];
      
      const criticalStock = labProducts.filter(p => p.stock <= 5);
      const watchStock = labProducts.filter(p => p.stock > 5 && p.stock <= 20);
      const optimalStock = labProducts.filter(p => p.stock > 20 && p.stock <= 50);
      const overStock = labProducts.filter(p => p.stock > 50);

      return {
        ...lab,
        criticalStockCount: criticalStock.length,
        watchStockCount: watchStock.length,
        optimalStockCount: optimalStock.length,
        overStockCount: overStock.length,
        criticalStockProducts: criticalStock,
        watchStockProducts: watchStock,
        optimalStockProducts: optimalStock,
        overStockProducts: overStock,
      };
    });
  }, [laboratories, productsByLab]);

  // Fonction pour afficher les produits filtrés
  const showFilteredProducts = (products: Product[], title: string) => {
    setFilteredProducts(products);
    setFilterTitle(title);
    setShowModal(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Synthèse des stocks par laboratoire
      </h4>
      
      <div className="space-y-3">
        {stockMetrics.map((labStock) => (
          <div 
            key={labStock.id} 
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-2"
          >
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {labStock.name}
            </h5>
            
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                title="Stocks critiques"
                description="Produits avec moins de 5 unités"
                value={labStock.criticalStockCount}
                icon="alert"
                colorScheme="red"
                filterType="stock"
                filterValue="critical"
                onShowDetails={() => showFilteredProducts(
                  labStock.criticalStockProducts, 
                  `${labStock.name} - Produits en stock critique`
                )}
              />
              
              <SummaryCard
                title="Stocks à surveiller"
                description="Produits avec 6-20 unités"
                value={labStock.watchStockCount}
                icon="alert-circle"
                colorScheme="amber"
                filterType="stock"
                filterValue="watch"
                onShowDetails={() => showFilteredProducts(
                  labStock.watchStockProducts, 
                  `${labStock.name} - Produits à surveiller`
                )}
              />
              
              <SummaryCard
                title="Stocks optimaux"
                description="Produits avec 21-50 unités"
                value={labStock.optimalStockCount}
                icon="check-circle"
                colorScheme="green"
                filterType="stock"
                filterValue="optimal"
                onShowDetails={() => showFilteredProducts(
                  labStock.optimalStockProducts, 
                  `${labStock.name} - Produits en stock optimal`
                )}
              />
              
              <SummaryCard
                title="Surstock"
                description="Produits avec plus de 50 unités"
                value={labStock.overStockCount}
                icon="inbox"
                colorScheme="blue"
                filterType="stock"
                filterValue="over"
                onShowDetails={() => showFilteredProducts(
                  labStock.overStockProducts, 
                  `${labStock.name} - Produits en surstock`
                )}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal pour afficher les produits filtrés */}
      <ProductFilterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        products={filteredProducts}
        title={filterTitle}
      />
    </div>
  );
}