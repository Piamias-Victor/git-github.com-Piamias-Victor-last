// src/components/dashboard/markets/summaries/MarketMarginSummary.tsx
import React, { useState, useMemo } from 'react';
import { FiTrendingDown, FiTrendingUp, FiArrowUp, FiChevronRight } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LoadingState } from '@/components/ui/LoadingState';

interface MarketMarginSummaryProps {
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

export function MarketMarginSummary({ segment, products, isLoading = false }: MarketMarginSummaryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Calculer les statistiques de marge
  const marginStats = useMemo(() => {
    if (products.length === 0) return {
      negativeMargins: 0,
      lowMargins: 0,
      goodMargins: 0,
      excellentMargins: 0
    };
    
    return {
      negativeMargins: products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate <= 0;
      }).length,
      
      lowMargins: products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate > 0 && rate < 20;
      }).length,
      
      goodMargins: products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate >= 20 && rate <= 35;
      }).length,
      
      excellentMargins: products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate > 35;
      }).length
    };
  }, [products]);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des marges..." />;
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
        Analyse des marges
      </h3>
      
      <div className="space-y-3">
        <SummaryCard
          title="Marges négatives"
          value={marginStats.negativeMargins}
          description="Produits vendus à perte"
          icon={<FiTrendingDown size={20} />}
          colorClass="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          onClick={() => setSelectedCategory('negative')}
        />
        
        <SummaryCard
          title="Faibles marges"
          value={marginStats.lowMargins}
          description="Marges inférieures à 20%"
          icon={<FiTrendingUp size={20} />}
          colorClass="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          onClick={() => setSelectedCategory('low')}
        />
        
        <SummaryCard
          title="Bonnes marges"
          value={marginStats.goodMargins}
          description="Marges entre 20% et 35%"
          icon={<FiArrowUp size={20} />}
          colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          onClick={() => setSelectedCategory('good')}
        />
        
        <SummaryCard
          title="Excellentes marges"
          value={marginStats.excellentMargins}
          description="Marges supérieures à 35%"
          icon={<FiChevronRight size={20} />}
          colorClass="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          onClick={() => setSelectedCategory('excellent')}
        />
      </div>
      
      {/* Modal simplifiée pour afficher les produits filtrés */}
      {selectedCategory && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedCategory === 'negative' && 'Produits à marge négative'}
              {selectedCategory === 'low' && 'Produits à faible marge'}
              {selectedCategory === 'good' && 'Produits à bonne marge'}
              {selectedCategory === 'excellent' && 'Produits à excellente marge'}
            </h4>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiTrendingDown size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedCategory === 'negative' && `${marginStats.negativeMargins} produits ont une marge négative, ce qui génère des pertes. Ces produits devraient être revus.`}
            {selectedCategory === 'low' && `${marginStats.lowMargins} produits ont une marge faible, inférieure à 20%.`}
            {selectedCategory === 'good' && `${marginStats.goodMargins} produits ont une marge satisfaisante, entre 20% et 35%.`}
            {selectedCategory === 'excellent' && `${marginStats.excellentMargins} produits ont une marge excellente, supérieure à 35%.`}
          </p>
        </div>
      )}
    </div>
  );
}