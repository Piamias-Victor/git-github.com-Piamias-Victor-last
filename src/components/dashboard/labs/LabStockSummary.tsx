// src/components/dashboard/labs/LabStockSummary.tsx
import React, { useState } from 'react';
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

  // Filtrer les produits pour l'ensemble des laboratoires sélectionnés
  const labProducts = allProducts.filter(product => 
    laboratories.some(lab => lab.name === product.laboratory)
  );

  // Calculer les métriques de stock
  const criticalStock = labProducts.filter(p => p.stock <= 5);
  const watchStock = labProducts.filter(p => p.stock > 5 && p.stock <= 20);
  const optimalStock = labProducts.filter(p => p.stock > 20 && p.stock <= 50);
  const overStock = labProducts.filter(p => p.stock > 50);

  // Fonction pour afficher les produits filtrés
  const showFilteredProducts = (filteredProducts: Product[], title: string) => {
    setFilteredProducts(filteredProducts);
    setFilterTitle(title);
    setShowModal(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Synthèse des stocks des laboratoires sélectionnés
      </h4>
      
      <div className="space-y-3">
        <SummaryCard
          title="Stocks critiques"
          description="Produits avec moins de 5 unités"
          value={criticalStock.length}
          icon="alert"
          colorScheme="red"
          filterType="stock"
          filterValue="critical"
          onShowDetails={() => showFilteredProducts(criticalStock, "Produits en stock critique")}
        />
        
        <SummaryCard
          title="Stocks à surveiller"
          description="Produits avec 6-20 unités"
          value={watchStock.length}
          icon="alert-circle"
          colorScheme="amber"
          filterType="stock"
          filterValue="watch"
          onShowDetails={() => showFilteredProducts(watchStock, "Produits à surveiller")}
        />
        
        <SummaryCard
          title="Stocks optimaux"
          description="Produits avec 21-50 unités"
          value={optimalStock.length}
          icon="check-circle"
          colorScheme="green"
          filterType="stock"
          filterValue="optimal"
          onShowDetails={() => showFilteredProducts(optimalStock, "Produits avec stock optimal")}
        />
        
        <SummaryCard
          title="Surstock"
          description="Produits avec plus de 50 unités"
          value={overStock.length}
          icon="inbox"
          colorScheme="blue"
          filterType="stock"
          filterValue="over"
          onShowDetails={() => showFilteredProducts(overStock, "Produits en surstock")}
        />
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