// src/components/dashboard/labs/LabMarginSummary.tsx
import React, { useState } from 'react';
import { Laboratory } from './LabResultTable';
import { Product } from '../products/ProductResultTable';
import { SummaryCard } from '../products/summaries/SummaryCard';
import { ProductFilterModal } from '../products/summaries/ProductFilterModal';

interface LabMarginSummaryProps {
  laboratories: Laboratory[];
  allProducts: Product[];
}

export function LabMarginSummary({ 
  laboratories, 
  allProducts 
}: LabMarginSummaryProps) {
  // État pour la modal de filtrage
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterTitle, setFilterTitle] = useState('');

  // Filtrer les produits pour l'ensemble des laboratoires sélectionnés
  const labProducts = allProducts.filter(product => 
    laboratories.some(lab => lab.name === product.laboratory)
  );
  
  // Calculer les métriques de marge
  const negativeMargins = labProducts.filter(p => {
    const rate = parseFloat(p.marginRate.replace('%', ''));
    return rate <= 0;
  });
  
  const lowMargins = labProducts.filter(p => {
    const rate = parseFloat(p.marginRate.replace('%', ''));
    return rate > 0 && rate < 20;
  });
  
  const goodMargins = labProducts.filter(p => {
    const rate = parseFloat(p.marginRate.replace('%', ''));
    return rate >= 20 && rate <= 35;
  });
  
  const excellentMargins = labProducts.filter(p => {
    const rate = parseFloat(p.marginRate.replace('%', ''));
    return rate > 35;
  });

  // Fonction pour afficher les produits filtrés
  const showFilteredProducts = (filteredProducts: Product[], title: string) => {
    setFilteredProducts(filteredProducts);
    setFilterTitle(title);
    setShowModal(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Synthèse des marges des laboratoires sélectionnés
      </h4>
      
      <div className="space-y-3">
        <SummaryCard
          title="Marges négatives"
          description="Produits à perte"
          value={negativeMargins.length}
          icon="trending-down"
          colorScheme="red"
          filterType="margin"
          filterValue="negative"
          onShowDetails={() => showFilteredProducts(negativeMargins, "Produits à marge négative")}
        />
        
        <SummaryCard
          title="Faibles marges"
          description="Marges inférieures à 20%"
          value={lowMargins.length}
          icon="trending-up"
          colorScheme="amber"
          filterType="margin"
          filterValue="low"
          onShowDetails={() => showFilteredProducts(lowMargins, "Produits à faible marge")}
        />
        
        <SummaryCard
          title="Bonnes marges"
          description="Marges entre 20% et 35%"
          value={goodMargins.length}
          icon="arrow-up"
          colorScheme="emerald"
          filterType="margin"
          filterValue="good"
          onShowDetails={() => showFilteredProducts(goodMargins, "Produits à bonne marge")}
        />
        
        <SummaryCard
          title="Excellentes marges"
          description="Marges supérieures à 35%"
          value={excellentMargins.length}
          icon="chart-line"
          colorScheme="green"
          filterType="margin"
          filterValue="excellent"
          onShowDetails={() => showFilteredProducts(excellentMargins, "Produits à excellente marge")}
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