// src/components/dashboard/markets/MarketDetailedAnalysis.tsx
import React, { useState, useEffect } from 'react';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { FiBarChart2, FiBox, FiTrendingUp, FiPieChart, FiPackage, FiCalendar, FiTarget } from 'react-icons/fi';
import { MarketSalesChart } from './charts/MarketSalesChart';
import { MarketStockChart } from './charts/MarketStockChart';
import { MarketTopProducts } from './MarketTopProducts';
import { MarketStockSummary } from './summaries/MarketStockSummary';
import { MarketMarginSummary } from './summaries/MarketMarginSummary';
import { MarketSalesTrendSummary } from './summaries/MarketSalesTrendSummary';
import { MarketComparisonChart } from './MarketComparisonChart';
import { MarketSegmentVisualization } from './visualization/MarketSegmentVisualization';
import { MarketAnnualForecast } from './forecast/MarketAnnualForecast';
import { MarketSegmentTable } from './MarketSegmentTable';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { mockProductData } from '@/utils/mockProductData';
import { useDateRange } from '@/providers/DateRangeProvider';

interface MarketDetailedAnalysisProps {
  segment: MarketSegment;
}

export function MarketDetailedAnalysis({ segment }: MarketDetailedAnalysisProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { startDate, endDate } = useDateRange();

  // Simuler le chargement des produits liés à ce segment
  useEffect(() => {
    const loadProductsForSegment = async () => {
      setIsLoading(true);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrer les produits mockés selon le type de segment
      let filteredProducts: Product[] = [];
      
      if (segment.type === 'universe') {
        // Tous les produits qui ont la catégorie liée à cet univers
        filteredProducts = mockProductData.filter(p => 
          ['Douleur & Fièvre', 'Antibiotiques', 'Système Digestif'].includes(p.category)
        );
      } else if (segment.type === 'category') {
        // Produits de cette catégorie spécifique
        filteredProducts = mockProductData.filter(p => 
          p.category === segment.name
        );
      } else if (segment.type === 'brand_lab' || segment.type === 'lab_distributor') {
        // Produits de ce laboratoire
        filteredProducts = mockProductData.filter(p => 
          p.laboratory === segment.name
        );
      } else {
        // Pour les autres types, utiliser un sous-ensemble aléatoire
        filteredProducts = mockProductData.slice(0, 10);
      }
      
      setProducts(filteredProducts);
      setIsLoading(false);
    };
    
    loadProductsForSegment();
  }, [segment]);

  return (
    <div className="space-y-8">
      {/* Section Ventes */}
      <SectionContainer 
        id="sales"
        title="Analyse des ventes"
        subtitle={`Évolution des ventes pour ${segment.name}`}
        icon={<FiBarChart2 size={22} />}
      >
        <MarketSalesChart
          segments={[segment]}
          startDate={startDate}
          endDate={endDate}
          isLoading={isLoading}
        />
      </SectionContainer>
      
      {/* Section Stock */}
      <SectionContainer
        id="stock"
        title="Analyse des stocks"
        subtitle={`Situation des stocks pour ${segment.name}`}
        icon={<FiBox size={22} />}
      >
        <MarketStockChart
          segment={segment}
          products={products}
          isLoading={isLoading}
        />
      </SectionContainer>
      
      {/* Section Synthèses */}
      <SectionContainer
        id="summaries"
        title="Synthèses et recommandations"
        subtitle="Analyse synthétique des données clés"
        icon={<FiTrendingUp size={22} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MarketStockSummary 
            segment={segment}
            products={products}
            isLoading={isLoading}
          />
          <MarketMarginSummary
            segment={segment}
            products={products}
            isLoading={isLoading}
          />
          <MarketSalesTrendSummary
            segment={segment}
            products={products}
            isLoading={isLoading}
          />
        </div>
      </SectionContainer>
      
      {/* Section Comparaison */}
      <SectionContainer
        id="comparison"
        title="Comparaison avec le marché"
        subtitle="Positionnement par rapport aux moyennes du marché"
        icon={<FiPieChart size={22} />}
      >
        <MarketComparisonChart
          segment={segment}
          products={products}
          isLoading={isLoading}
        />
      </SectionContainer>
      
      {/* Section Top Produits */}
      <SectionContainer
        id="products"
        title="Top produits"
        subtitle={`Produits les plus performants pour ${segment.name}`}
        icon={<FiPackage size={22} />}
      >
        <MarketTopProducts
          segment={segment}
          products={products}
          isLoading={isLoading}
        />
      </SectionContainer>
      
      {/* Section Segments */}
      <SectionContainer
        id="segments"
        title="Analyse par segment"
        subtitle="Répartition des ventes et tendances par segment"
        icon={<FiCalendar size={22} />}
      >
        <MarketSegmentVisualization
          segment={segment}
          products={products}
          isLoading={isLoading}
        />
      </SectionContainer>
      
      {/* Section Prévisions */}
      <SectionContainer
        id="forecast"
        title="Prévisions annuelles"
        subtitle="Projections de ventes et tendances à venir"
        icon={<FiTarget size={22} />}
      >
        <MarketAnnualForecast
          segment={segment}
          isLoading={isLoading}
        />
      </SectionContainer>
      
      {/* Section Liste des produits */}
      <SectionContainer
        id="products-list"
        title="Produits du segment"
        subtitle={`Liste complète des produits pour ${segment.name}`}
        icon={<FiPackage size={22} />}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nom</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Laboratoire</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Catégorie</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Stock</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Prix</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Marge</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ventes</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.laboratory}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">{product.stock}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">{product.price} €</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">{product.marginRate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">{product.sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Aucun produit trouvé pour ce segment.
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}