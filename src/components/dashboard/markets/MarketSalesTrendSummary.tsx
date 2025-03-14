// src/components/dashboard/markets/summaries/MarketSalesTrendSummary.tsx
import React, { useState, useMemo } from 'react';
import { FiArrowDown, FiChevronRight, FiGrid, FiChevronLeft, FiArrowUp } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LoadingState } from '@/components/ui/LoadingState';

interface MarketSalesTrendSummaryProps {
  segment: MarketSegment;
  products: Product[];
  isLoading?: boolean;
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  onClick?: () => void;
}

function SummaryCard({ title, value, description, icon, colorClass, onClick }: SummaryCardProps) {
  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200 ${colorClass}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="p-2 rounded-full bg-white bg-opacity-30 mr-3">
          {icon}
        </div>
        <div>
          <div className="font-semibold text-lg mb-1">{value}</div>
          <div className="font-medium text-sm mb-1">{title}</div>
          <div className="text-xs opacity-90">{description}</div>
        </div>
      </div>
    </div>
  );
}

export function MarketSalesTrendSummary({ segment, products, isLoading = false }: MarketSalesTrendSummaryProps) {
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  
  // Simuler des tendances pour les produits
  const trendStats = useMemo(() => {
    if (products.length === 0) return {
      highDecline: 0,
      lowDecline: 0,
      stable: 0,
      lowGrowth: 0,
      highGrowth: 0
    };
    
    // Fonction pour simuler une tendance basée sur un hash du nom du produit
    const assignTrend = (product: Product) => {
      const hash = product.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const normalized = hash % 100;
      
      if (normalized < 12) return 'highDecline';
      if (normalized < 33) return 'lowDecline';
      if (normalized < 68) return 'stable';
      if (normalized < 86) return 'lowGrowth';
      return 'highGrowth';
    };
    
    // Compter les produits par tendance
    const trends = {
      highDecline: 0,
      lowDecline: 0,
      stable: 0,
      lowGrowth: 0,
      highGrowth: 0
    };
    
    products.forEach(product => {
      const trend = assignTrend(product);
      trends[trend]++;
    });
    
    return trends;
  }, [products]);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des tendances de vente..." />;
  }

  // Si aucun produit
  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun produit trouvé pour ce segment.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Tendances des ventes
      </h3>
      
      <div className="space-y-3">
        <SummaryCard
          title="Forte baisse"
          value={trendStats.highDecline}
          description="Baisse > 15% sur 3 mois"
          icon={<FiArrowDown size={20} />}
          colorClass="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          onClick={() => setSelectedTrend('highDecline')}
        />
        
        <SummaryCard
          title="Légère baisse"
          value={trendStats.lowDecline}
          description="Baisse entre 5% et 15%"
          icon={<FiChevronRight size={20} />}
          colorClass="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          onClick={() => setSelectedTrend('lowDecline')}
        />
        
        <SummaryCard
          title="Stable"
          value={trendStats.stable}
          description="Variation entre -5% et 5%"
          icon={<FiGrid size={20} />}
          colorClass="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          onClick={() => setSelectedTrend('stable')}
        />
        
        <SummaryCard
          title="Légère hausse"
          value={trendStats.lowGrowth}
          description="Hausse entre 5% et 15%"
          icon={<FiChevronLeft size={20} />}
          colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          onClick={() => setSelectedTrend('lowGrowth')}
        />
        
        <SummaryCard
          title="Forte hausse"
          value={trendStats.highGrowth}
          description="Hausse > 15% sur 3 mois"
          icon={<FiArrowUp size={20} />}
          colorClass="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          onClick={() => setSelectedTrend('highGrowth')}
        />
      </div>
      
      {/* Modal simplifiée pour afficher les produits filtrés */}
      {selectedTrend && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedTrend === 'highDecline' && 'Produits en forte baisse'}
              {selectedTrend === 'lowDecline' && 'Produits en légère baisse'}
              {selectedTrend === 'stable' && 'Produits stables'}
              {selectedTrend === 'lowGrowth' && 'Produits en légère hausse'}
              {selectedTrend === 'highGrowth' && 'Produits en forte hausse'}
            </h4>
            <button 
              onClick={() => setSelectedTrend(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiArrowUp size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedTrend === 'highDecline' && `${trendStats.highDecline} produits sont en forte baisse, avec une diminution de plus de 15% des ventes sur les 3 derniers mois.`}
            {selectedTrend === 'lowDecline' && `${trendStats.lowDecline} produits sont en légère baisse, avec une diminution comprise entre 5% et 15% des ventes.`}
            {selectedTrend === 'stable' && `${trendStats.stable} produits sont stables, avec une variation des ventes comprise entre -5% et +5%.`}
            {selectedTrend === 'lowGrowth' && `${trendStats.lowGrowth} produits sont en légère hausse, avec une augmentation comprise entre 5% et 15% des ventes.`}
            {selectedTrend === 'highGrowth' && `${trendStats.highGrowth} produits sont en forte hausse, avec une augmentation de plus de 15% des ventes sur les 3 derniers mois.`}
          </p>
        </div>
      )}
    </div>
  );
}