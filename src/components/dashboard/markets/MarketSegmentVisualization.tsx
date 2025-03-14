// src/components/dashboard/markets/visualization/MarketSegmentVisualization.tsx
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LoadingState } from '@/components/ui/LoadingState';
import { formatCurrency } from '@/utils/formatters';

interface MarketSegmentVisualizationProps {
  segment: MarketSegment;
  products: Product[];
  isLoading?: boolean;
}

export function MarketSegmentVisualization({ 
  segment, 
  products, 
  isLoading = false 
}: MarketSegmentVisualizationProps) {
  const [chartType, setChartType] = useState<'category' | 'laboratory'>('category');
  
  // Générer les données pour le graphique
  const chartData = useMemo(() => {
    if (products.length === 0) return [];
    
    // Regrouper par catégorie ou par laboratoire selon le type sélectionné
    const groupedData: Record<string, { count: number, revenue: number }> = {};
    
    products.forEach(product => {
      const key = chartType === 'category' ? product.category : product.laboratory;
      
      if (!groupedData[key]) {
        groupedData[key] = { count: 0, revenue: 0 };
      }
      
      groupedData[key].count += 1;
      groupedData[key].revenue += parseFloat(product.price) * product.sales;
    });
    
    // Convertir en tableau pour le graphique et trier par revenu
    return Object.entries(groupedData)
      .map(([name, data]) => ({
        name,
        value: data.revenue,
        count: data.count,
        products: `${data.count} produit${data.count > 1 ? 's' : ''}`
      }))
      .sort((a, b) => b.value - a.value);
  }, [products, chartType]);

  // Couleurs pour le graphique
  const COLORS = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#14B8A6', '#D97706', '#BE185D'
  ];

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des segments..." />;
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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          Répartition par {chartType === 'category' ? 'catégorie' : 'laboratoire'}
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('category')}
            className={`px-3 py-1 text-sm rounded-l-md ${
              chartType === 'category'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Catégories
          </button>
          <button
            onClick={() => setChartType('laboratory')}
            className={`px-3 py-1 text-sm rounded-r-md ${
              chartType === 'laboratory'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Laboratoires
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Chiffre d\'affaires']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Top {chartType === 'category' ? 'catégories' : 'laboratoires'}
          </h4>
          
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {chartType === 'category' ? 'Catégorie' : 'Laboratoire'}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Produits
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CA
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Part
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {chartData.slice(0, 6).map((item, index) => {
                  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = (item.value / totalValue) * 100;
                  
                  return (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <div 
                            className="h-3 w-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          {item.name}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {item.count}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {formatCurrency(item.value)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-indigo-600 dark:text-indigo-400">
                        {percentage.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-auto pt-6">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Analyse
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {chartType === 'category' 
                  ? `Le segment ${segment.name} est principalement représenté par la catégorie ${chartData[0]?.name || ''} qui représente ${chartData[0] ? ((chartData[0].value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1) : 0}% du chiffre d'affaires.` 
                  : `Le laboratoire ${chartData[0]?.name || ''} domine ce segment avec ${chartData[0] ? ((chartData[0].value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1) : 0}% de part de marché.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}