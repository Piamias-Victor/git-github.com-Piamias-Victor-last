// src/components/dashboard/products/summaries/StockSummary.tsx
import React, { useState } from 'react';
import { Product } from '../ProductResultTable';
import { SummaryCard } from './SummaryCard';
import { ProductFilterModal } from './ProductFilterModal';

interface StockSummaryProps {
  products: Product[];
}

export function StockSummary({ products }: StockSummaryProps) {
  // État pour la modal de filtrage
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterTitle, setFilterTitle] = useState('');
  
  // Calculer les métriques de stock
  const criticalStock = products.filter(p => p.stock <= 5);
  const watchStock = products.filter(p => p.stock > 5 && p.stock <= 20);
  const optimalStock = products.filter(p => p.stock > 20 && p.stock <= 50);
  const overStock = products.filter(p => p.stock > 50);

  // Fonction pour afficher les produits filtrés
  const showFilteredProducts = (filteredProducts: Product[], title: string) => {
    setFilteredProducts(filteredProducts);
    setFilterTitle(title);
    setShowModal(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Synthèse des stocks
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