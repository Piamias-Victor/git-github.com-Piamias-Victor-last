// src/components/dashboard/markets/summaries/MarketStockSummary.tsx
import React, { useState, useMemo } from 'react';
import { FiAlertCircle, FiEye, FiCheckCircle, FiInbox } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LoadingState } from '@/components/ui/LoadingState';

interface MarketStockSummaryProps {
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

export function MarketStockSummary({ segment, products, isLoading = false }: MarketStockSummaryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Calculer les statistiques de stock
  const stockStats = useMemo(() => {
    if (products.length === 0) return {
      criticalStock: 0,
      watchStock: 0,
      optimalStock: 0,
      overStock: 0
    };
    
    return {
      criticalStock: products.filter(p => p.stock <= 5).length,
      watchStock: products.filter(p => p.stock > 5 && p.stock <= 20).length,
      optimalStock: products.filter(p => p.stock > 20 && p.stock <= 50).length,
      overStock: products.filter(p => p.stock > 50).length
    };
  }, [products]);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des stocks..." />;
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
        État des stocks
      </h3>
      
      <div className="space-y-3">
        <SummaryCard
          title="Stocks critiques"
          value={stockStats.criticalStock}
          description="Produits avec moins de 5 unités"
          icon={<FiAlertCircle size={20} />}
          colorClass="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          onClick={() => setSelectedCategory('critical')}
        />
        
        <SummaryCard
          title="Stocks à surveiller"
          value={stockStats.watchStock}
          description="Produits avec 6-20 unités"
          icon={<FiEye size={20} />}
          colorClass="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          onClick={() => setSelectedCategory('watch')}
        />
        
        <SummaryCard
          title="Stocks optimaux"
          value={stockStats.optimalStock}
          description="Produits avec 21-50 unités"
          icon={<FiCheckCircle size={20} />}
          colorClass="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          onClick={() => setSelectedCategory('optimal')}
        />
        
        <SummaryCard
          title="Surstock"
          value={stockStats.overStock}
          description="Produits avec plus de 50 unités"
          icon={<FiInbox size={20} />}
          colorClass="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          onClick={() => setSelectedCategory('over')}
        />
      </div>
      
      {/* Modal pour afficher les produits filtrés - ici simplement en version simplifiée */}
      {selectedCategory && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedCategory === 'critical' && 'Produits en stock critique'}
              {selectedCategory === 'watch' && 'Produits à surveiller'}
              {selectedCategory === 'optimal' && 'Produits avec stock optimal'}
              {selectedCategory === 'over' && 'Produits en surstock'}
            </h4>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiAlertCircle size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedCategory === 'critical' && 
              `${stockStats.criticalStock} produits ont un stock critique nécessitant une attention immédiate.`}
            {selectedCategory === 'watch' && 
              `${stockStats.watchStock} produits sont à surveiller et pourraient nécessiter un réapprovisionnement prochainement.`}
            {selectedCategory === 'optimal' && 
              `${stockStats.optimalStock} produits ont un niveau de stock optimal.`}
            {selectedCategory === 'over' && 
              `${stockStats.overStock} produits sont en surstock, ce qui pourrait immobiliser du capital.`}
          </p>
        </div>
      )}
    </div>
  );
}