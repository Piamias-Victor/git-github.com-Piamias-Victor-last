// src/components/dashboard/products/summaries/SalesTrendSummary.tsx
import React, { useState, useMemo } from 'react';
import { Product } from '../ProductResultTable';
import { SummaryCard } from './SummaryCard';
import { ProductFilterModal } from './ProductFilterModal';

interface SalesTrendSummaryProps {
  products: Product[];
}

export function SalesTrendSummary({ products }: SalesTrendSummaryProps) {
  // État pour la modal de filtrage
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterTitle, setFilterTitle] = useState('');

  // Simuler des tendances pour les produits (dans une application réelle, ces données viendraient de la BD)
  const trends = useMemo(() => {
    const assignTrend = (product: Product) => {
      // Simuler une tendance basée sur un hash du nom du produit (pour être cohérent)
      const hash = product.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const normalized = hash % 100;
      
      if (normalized < 12) return 'high-decline';
      if (normalized < 33) return 'low-decline';
      if (normalized < 68) return 'stable';
      if (normalized < 86) return 'low-growth';
      return 'high-growth';
    };
    
    return products.reduce((acc, product) => {
      const trend = assignTrend(product);
      if (!acc[trend]) acc[trend] = [];
      acc[trend].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);
  
  // Extraire les produits par tendance
  const highDecline = trends['high-decline'] || [];
  const lowDecline = trends['low-decline'] || [];
  const stable = trends['stable'] || [];
  const lowGrowth = trends['low-growth'] || [];
  const highGrowth = trends['high-growth'] || [];

  // Fonction pour afficher les produits filtrés
  const showFilteredProducts = (filteredProducts: Product[], title: string) => {
    setFilteredProducts(filteredProducts);
    setFilterTitle(title);
    setShowModal(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Évolution des ventes
      </h4>
      
      <div className="space-y-3">
        <SummaryCard
          title="Forte baisse"
          description="Baisse > 15% sur 3 mois"
          value={highDecline.length}
          icon="arrow-down"
          colorScheme="red"
          filterType="trend"
          filterValue="high-decline"
          onShowDetails={() => showFilteredProducts(highDecline, "Produits en forte baisse")}
        />
        
        <SummaryCard
          title="Légère baisse"
          description="Baisse entre 5% et 15%"
          value={lowDecline.length}
          icon="chevron-right"
          colorScheme="amber"
          filterType="trend"
          filterValue="low-decline"
          onShowDetails={() => showFilteredProducts(lowDecline, "Produits en légère baisse")}
        />
        
        <SummaryCard
          title="Stable"
          description="Variation entre -5% et 5%"
          value={stable.length}
          icon="grid"
          colorScheme="blue"
          filterType="trend"
          filterValue="stable"
          onShowDetails={() => showFilteredProducts(stable, "Produits stables")}
        />
        
        <SummaryCard
          title="Légère hausse"
          description="Hausse entre 5% et 15%"
          value={lowGrowth.length}
          icon="chevron-left"
          colorScheme="emerald"
          filterType="trend"
          filterValue="low-growth"
          onShowDetails={() => showFilteredProducts(lowGrowth, "Produits en légère hausse")}
        />
        
        <SummaryCard
          title="Forte hausse"
          description="Hausse > 15% sur 3 mois"
          value={highGrowth.length}
          icon="arrow-up"
          colorScheme="green"
          filterType="trend"
          filterValue="high-growth"
          onShowDetails={() => showFilteredProducts(highGrowth, "Produits en forte hausse")}
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