import React, { useEffect, useState } from 'react';
import { useDateRange } from '@/providers/DateRangeProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { Product } from './ProductResultTable';
import { ProductTopRankings } from './ProductTopRankings';

interface ProductsAggregateChartsProps {
  products: Product[];
}

export function ProductsAggregateCharts({ products }: ProductsAggregateChartsProps) {
  const { startDate, endDate } = useDateRange();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateAggregateData = async () => {
      if (!products.length || !startDate || !endDate) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Générer les données pour les 6 derniers mois
        const salesAggregateData = generateMockSalesData(products);
        const stockAggregateData = generateMockStockData(products);
        
        setSalesData(salesAggregateData);
        setStockData(stockAggregateData);
      } catch (err) {
        console.error('Erreur lors de la génération des données agrégées:', err);
        setError('Impossible de générer les graphiques agrégés.');
      } finally {
        setIsLoading(false);
      }
    };

    generateAggregateData();
  }, [products, startDate, endDate]);

  if (products.length === 0) return null;
  if (isLoading) return <LoadingState height="60" message="Génération des graphiques d'analyse globale..." />;
  if (error) return <ErrorState message={error} />;

  // Définition des séries pour les graphiques
  const salesSeries = [
    { dataKey: "quantity", name: "Quantité vendue", color: "#4F46E5" },
    { dataKey: "revenue", name: "CA (€)", color: "#10B981" },
    { dataKey: "margin", name: "Marge (€)", color: "#F59E0B" }
  ];

  const stockSeries = [
    { dataKey: "stock", name: "Quantité en stock", color: "#4F46E5" },
    { dataKey: "stockValue", name: "Valeur du stock (€)", color: "#10B981" }
  ];

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Analyse globale des {products.length} produits sélectionnés
      </h3>
      
      {/* Nous avons supprimé la répartition par catégorie comme demandé */}
      
      {/* Graphique des ventes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Évolution des ventes cumulées
          </h4>
          <ChartLegend series={salesSeries} />
        </div>
        
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatChartDate}
                stroke="#6B7280"
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }} 
                formatter={(value: any) => [`${value}`, '']}
                labelFormatter={formatTooltipDate}
              />
              {salesSeries.map(serie => (
                <Line 
                  key={serie.dataKey}
                  type="monotone" 
                  dataKey={serie.dataKey} 
                  stroke={serie.color} 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={serie.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          Données entre {formatDisplayDate(startDate)} et {formatDisplayDate(endDate)}
        </div>
      </div>
      
      {/* Graphique des stocks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            État des stocks pour les produits sélectionnés
          </h4>
          <ChartLegend series={stockSeries} />
        </div>
        
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatChartDate}
                stroke="#6B7280"
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }} 
                formatter={(value: any) => [`${value}`, '']}
                labelFormatter={formatTooltipDate}
              />
              {stockSeries.map(serie => (
                <Bar 
                  key={serie.dataKey}
                  dataKey={serie.dataKey} 
                  fill={serie.color} 
                  name={serie.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          Niveaux de stock moyens par mois
        </div>
      </div>
      
      {/* Synthèses et classements */}
      <div className="grid md:grid-cols-2 gap-6">
        <ProductTopRankings products={products} />
        
        {/* Synthèse des stocks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Synthèse des stocks
          </h4>
          
          <div className="space-y-3">
            {/* Indicateurs de stock */}
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Stocks critiques</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Produits avec moins de 5 unités</div>
                </div>
              </div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {products.filter(p => p.stock <= 5).length}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Stocks à surveiller</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Produits avec 6-20 unités</div>
                </div>
              </div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {products.filter(p => p.stock > 5 && p.stock <= 20).length}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Stocks optimaux</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Produits avec 21-50 unités</div>
                </div>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {products.filter(p => p.stock > 20 && p.stock <= 50).length}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Surstock</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Produits avec plus de 50 unités</div>
                </div>
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {products.filter(p => p.stock > 50).length}
              </div>
            </div>
          </div>
        </div>

        {/* Synthèse des marges */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Synthèse des marges
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Marges négatives</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Produits à perte</div>
                </div>
              </div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {products.filter(p => parseFloat(p.marginRate) <= 0).length}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Faibles marges</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Marges inférieures à 20%</div>
                </div>
              </div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {products.filter(p => {
                  const rate = parseFloat(p.marginRate);
                  return rate > 0 && rate < 20;
                }).length}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Bonnes marges</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Marges entre 20% et 35%</div>
                </div>
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {products.filter(p => {
                  const rate = parseFloat(p.marginRate);
                  return rate >= 20 && rate <= 35;
                }).length}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414L11.707 11.7a1 1 0 01-1.414 0L7 8.414 3.707 11.7a1 1 0 01-1.414-1.413l4-4a1 1 0 011.414 0L11 9.586 14.586 6H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Excellentes marges</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Marges supérieures à 35%</div>
                </div>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {products.filter(p => parseFloat(p.marginRate) > 35).length}
              </div>
            </div>
          </div>
        </div>
        
        {/* Synthèse des évolutions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Évolution des ventes
          </h4>
          
          <div className="space-y-3">
            {/* Indicateurs d'évolution simulés */}
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Forte baisse</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Baisse > 15% sur 3 mois</div>
                </div>
              </div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {Math.floor(products.length * 0.12)}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 9.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Légère baisse</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Baisse entre 5% et 15%</div>
                </div>
              </div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {Math.floor(products.length * 0.21)}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Stable</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Variation entre -5% et 5%</div>
                </div>
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(products.length * 0.35)}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 110 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Légère hausse</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Hausse entre 5% et 15%</div>
                </div>
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.floor(products.length * 0.18)}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Forte hausse</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Hausse > 15% sur 3 mois</div>
                </div>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {Math.floor(products.length * 0.14)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction qui génère des données de ventes simulées pour l'ensemble des produits
function generateMockSalesData(products: Product[]): any[] {
  // Calculer la période (6 derniers mois)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5); // 6 mois incluant le mois actuel
  
  const monthlyData = [];
  const currentDate = new Date(startDate);
  
  // Facteurs pour ajouter des variations saisonnières et des tendances
  const seasonalEffect = [1.2, 1.1, 1.0, 0.9, 1.0, 1.1]; // Effet saisonnier par mois
  
  // Pour chaque mois dans la période
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(currentDate);
    
    // Base pour les métriques agrégées
    const totalQuantity = products.reduce((sum, product) => {
      return sum + Math.floor(product.sales * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
    }, 0);
    
    const totalRevenue = products.reduce((sum, product) => {
      const monthSales = Math.floor(product.sales * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
      return sum + (parseFloat(product.price) * monthSales);
    }, 0);
    
    const totalMargin = products.reduce((sum, product) => {
      const monthSales = Math.floor(product.sales * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
      return sum + (parseFloat(product.margin) * monthSales);
    }, 0);
    
    monthlyData.push({
      date: monthDate.toISOString().split('T')[0],
      quantity: totalQuantity,
      revenue: Math.round(totalRevenue * 100) / 100,
      margin: Math.round(totalMargin * 100) / 100
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return monthlyData;
}

// Fonction qui génère des données de stock simulées pour l'ensemble des produits
function generateMockStockData(products: Product[]): any[] {
  // Calculer la période (6 derniers mois)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5); // 6 mois incluant le mois actuel
  
  const monthlyData = [];
  const currentDate = new Date(startDate);
  
  // Facteurs pour ajouter des variations saisonnières
  const seasonalEffect = [1.1, 1.0, 0.9, 1.0, 1.1, 1.2]; // Effet inverse pour les stocks
  
  // Pour chaque mois dans la période
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(currentDate);
    
    // Stock total agrégé pour ce mois
    const totalStock = products.reduce((sum, product) => {
      return sum + Math.floor(product.stock * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
    }, 0);
    
    // Valeur totale du stock pour ce mois
    const totalStockValue = products.reduce((sum, product) => {
      const monthStock = Math.floor(product.stock * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
      return sum + (parseFloat(product.price) * monthStock);
    }, 0);
    
    monthlyData.push({
      date: monthDate.toISOString().split('T')[0],
      stock: totalStock,
      stockValue: Math.round(totalStockValue * 100) / 100
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return monthlyData;
}