// src/components/dashboard/markets/MarketComparisonChart.tsx
import React, { useState, useMemo } from 'react';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface MarketComparisonChartProps {
  segment: MarketSegment;
  products: Product[];
  isLoading?: boolean;
}

export function MarketComparisonChart({ 
  segment, 
  products, 
  isLoading = false 
}: MarketComparisonChartProps) {
  const [showPercentages, setShowPercentages] = useState<boolean>(true);
  
  // Calculer les métriques de comparaison
  const comparisonData = useMemo(() => {
    if (products.length === 0) return {
      radarData: [],
      metrics: {}
    };
    
    // Métriques pour le segment actuel
    const avgPrice = products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length;
    const avgMargin = products.reduce((sum, p) => sum + parseFloat(p.margin), 0) / products.length;
    const avgRotation = products.reduce((sum, p) => sum + (p.sales / Math.max(1, p.stock)), 0) / products.length;
    const avgStock = products.reduce((sum, p) => sum + p.stock, 0) / products.length;
    const avgSales = products.reduce((sum, p) => sum + p.sales, 0) / products.length;
    
    // Métriques de référence du marché (simulées)
    const marketAvgPrice = avgPrice * 0.9; // La moyenne du marché est 10% plus basse
    const marketAvgMargin = avgMargin * 0.95; // 5% plus basse
    const marketAvgRotation = avgRotation * 0.85; // 15% plus basse
    const marketAvgStock = avgStock * 1.2; // 20% plus élevée
    const marketAvgSales = avgSales * 0.8; // 20% plus basse
    
    // Données pour le graphique radar (normalisées)
    const radarData = [
      {
        metric: 'Prix moyen',
        [segment.name]: 100,
        'Moyenne marché': (marketAvgPrice / avgPrice) * 100,
        absolute: {
          [segment.name]: avgPrice,
          'Moyenne marché': marketAvgPrice
        }
      },
      {
        metric: 'Marge',
        [segment.name]: 100,
        'Moyenne marché': (marketAvgMargin / avgMargin) * 100,
        absolute: {
          [segment.name]: avgMargin,
          'Moyenne marché': marketAvgMargin
        }
      },
      {
        metric: 'Rotation',
        [segment.name]: 100,
        'Moyenne marché': (marketAvgRotation / avgRotation) * 100,
        absolute: {
          [segment.name]: avgRotation,
          'Moyenne marché': marketAvgRotation
        }
      },
      {
        metric: 'Stock',
        [segment.name]: 100,
        'Moyenne marché': (marketAvgStock / avgStock) * 100,
        absolute: {
          [segment.name]: avgStock,
          'Moyenne marché': marketAvgStock
        }
      },
      {
        metric: 'Ventes',
        [segment.name]: 100,
        'Moyenne marché': (marketAvgSales / avgSales) * 100,
        absolute: {
          [segment.name]: avgSales,
          'Moyenne marché': marketAvgSales
        }
      }
    ];
    
    // Métriques détaillées
    const metrics = {
      price: { your: avgPrice, market: marketAvgPrice, diff: (avgPrice / marketAvgPrice - 1) * 100 },
      margin: { your: avgMargin, market: marketAvgMargin, diff: (avgMargin / marketAvgMargin - 1) * 100 },
      rotation: { your: avgRotation, market: marketAvgRotation, diff: (avgRotation / marketAvgRotation - 1) * 100 },
      stock: { your: avgStock, market: marketAvgStock, diff: (avgStock / marketAvgStock - 1) * 100 },
      sales: { your: avgSales, market: marketAvgSales, diff: (avgSales / marketAvgSales - 1) * 100 }
    };
    
    return { radarData, metrics };
  }, [products, segment.name]);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse comparative en cours..." />;
  }

  // Si aucun produit
  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Données insuffisantes pour l'analyse comparative.
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comparaison avec le marché
          </h3>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPercentages(true)}
              className={`px-3 py-1 text-sm rounded-l-md ${
                showPercentages
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Relatif (%)
            </button>
            <button
              onClick={() => setShowPercentages(false)}
              className={`px-3 py-1 text-sm rounded-r-md ${
                !showPercentages
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Absolu
            </button>
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Cette analyse compare la performance de {segment.name} par rapport à la moyenne du marché.
            {showPercentages && ' Les valeurs sont exprimées en pourcentage (100% = base de référence).'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.entries(comparisonData.metrics).map(([key, data]) => {
            const title = key === 'price' ? 'Prix moyen' :
                         key === 'margin' ? 'Marge' :
                         key === 'rotation' ? 'Rotation' :
                         key === 'stock' ? 'Stock' : 'Ventes';
            
            const isPositive = 
              (key === 'price' && data.diff < 0) || // Pour le prix, c'est mieux d'être moins cher
              (key === 'stock' && data.diff < 0) || // Pour le stock, c'est mieux d'avoir moins (rotation plus rapide)
              (key !== 'price' && key !== 'stock' && data.diff > 0); // Pour les autres, c'est mieux d'avoir plus
            
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {key === 'price' || key === 'margin' 
                      ? formatCurrency(data.your) 
                      : data.your.toFixed(1)}
                  </span>
                  <span className={`text-sm font-medium ${
                    isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isPositive ? '+' : ''}{data.diff.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Marché: {key === 'price' || key === 'margin' 
                    ? formatCurrency(data.market) 
                    : data.market.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={comparisonData.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis 
                angle={90} 
                domain={showPercentages ? [0, 150] : 'auto'} 
              />
              <Radar
                name={segment.name}
                dataKey={segment.name}
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.6}
              />
              <Radar
                name="Moyenne marché"
                dataKey="Moyenne marché"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (showPercentages) {
                    return [`${value.toFixed(1)}%`, name];
                  }
                  
                  const metric = props.payload.metric;
                  const absoluteValue = props.payload.absolute[name];
                  
                  if (metric === 'Prix moyen' || metric === 'Marge') {
                    return [formatCurrency(absoluteValue), name];
                  }
                  
                  return [absoluteValue.toFixed(1), name];
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interprétation
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {segment.name} se démarque principalement par 
            {Object.entries(comparisonData.metrics)
              .filter(([key, data]) => Math.abs(data.diff) > 10)
              .sort((a, b) => Math.abs(b[1].diff) - Math.abs(a[1].diff))
              .slice(0, 2)
              .map(([key, data], index, arr) => {
                const metricName = key === 'price' ? 'des prix' :
                                key === 'margin' ? 'des marges' :
                                key === 'rotation' ? 'une rotation' :
                                key === 'stock' ? 'des stocks' : 'des ventes';
                                
                const comparison = data.diff > 0 ? 'supérieurs' : 'inférieurs';
                
                return `${index === 0 ? ' ' : ' et '}${metricName} ${comparison} de ${Math.abs(data.diff).toFixed(1)}%`;
              })
              .join('')} par rapport à la moyenne du marché.
            {Object.entries(comparisonData.metrics).every(([_, data]) => Math.abs(data.diff) < 5) &&
              " Les performances sont globalement alignées avec la moyenne du marché sans écart significatif."
            }
          </p>
        </div>
      </div>
    </Card>
  );
}