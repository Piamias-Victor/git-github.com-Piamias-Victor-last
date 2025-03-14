// src/components/dashboard/markets/MarketTopProducts.tsx
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LoadingState } from '@/components/ui/LoadingState';
import { formatCurrency } from '@/utils/formatters';

interface MarketTopProductsProps {
  segment: MarketSegment;
  products: Product[];
  isLoading?: boolean;
}

export function MarketTopProducts({ 
  segment, 
  products, 
  isLoading = false 
}: MarketTopProductsProps) {
  const [metric, setMetric] = useState<'sales' | 'revenue' | 'margin'>('sales');
  
  // Calculer les données pour les Top 10 produits
  const topProductsData = useMemo(() => {
    if (products.length === 0) return [];
    
    // Calculer les métriques pour chaque produit
    const productsWithMetrics = products.map(product => {
      const sales = product.sales;
      const revenue = sales * parseFloat(product.price);
      const margin = sales * parseFloat(product.margin);
      const marginRate = parseFloat(product.marginRate.replace('%', ''));
      
      return {
        ...product,
        salesMetric: sales,
        revenueMetric: revenue,
        marginMetric: margin,
        marginRate
      };
    });
    
    // Trier selon la métrique sélectionnée
    const sortedProducts = [...productsWithMetrics].sort((a, b) => {
      if (metric === 'sales') return b.salesMetric - a.salesMetric;
      if (metric === 'revenue') return b.revenueMetric - a.revenueMetric;
      return b.marginMetric - a.marginMetric;
    });
    
    // Prendre les 10 premiers
    return sortedProducts.slice(0, 10).map(product => ({
      name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
      fullName: product.name,
      value: metric === 'sales' 
        ? product.salesMetric 
        : metric === 'revenue' 
          ? product.revenueMetric 
          : product.marginMetric,
      laboratory: product.laboratory,
      category: product.category,
      stock: product.stock,
      ean: product.ean,
      marginRate: product.marginRate
    }));
  }, [products, metric]);

  // Couleurs pour les barres
  const COLORS = [
    '#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE', '#DDD6FE',
    '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'
  ];

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des produits..." />;
  }

  // Si aucun produit
  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun produit trouvé pour ce segment.
      </div>
    );
  }

  // Formatter le tooltip content
  const renderTooltip = (props: any) => {
    const { active, payload } = props;
    
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-1">{data.fullName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.laboratory}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.category}</p>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {metric === 'sales' 
                ? `${data.value} ventes` 
                : metric === 'revenue' 
                  ? formatCurrency(data.value)
                  : formatCurrency(data.value)
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Stock: {data.stock} · Marge: {data.marginRate}
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          Top 10 produits {segment.name}
        </h3>
        
        <div className="flex space-x-1 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setMetric('sales')}
            className={`px-3 py-1 text-sm ${
              metric === 'sales'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Ventes
          </button>
          <button
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1 text-sm ${
              metric === 'revenue'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            CA
          </button>
          <button
            onClick={() => setMetric('margin')}
            className={`px-3 py-1 text-sm ${
              metric === 'margin'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Marge
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProductsData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              type="number"
              tickFormatter={(value) => 
                metric === 'sales' 
                  ? value.toString()
                  : `${(value / 1000).toFixed(0)}k€`
              }
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={renderTooltip} />
            <Bar 
              dataKey="value" 
              name={
                metric === 'sales' 
                  ? 'Ventes' 
                  : metric === 'revenue' 
                    ? 'Chiffre d\'affaires' 
                    : 'Marge'
              }
              radius={[0, 4, 4, 0]}
            >
              {topProductsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Top produit
          </h4>
          {topProductsData.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {topProductsData[0].fullName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {topProductsData[0].laboratory} · {topProductsData[0].category}
              </p>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {metric === 'sales' 
                    ? `${topProductsData[0].value} ventes` 
                    : metric === 'revenue' 
                      ? formatCurrency(topProductsData[0].value)
                      : formatCurrency(topProductsData[0].value)
                  }
                </span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  EAN: {topProductsData[0].ean}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Répartition des laboratoires
          </h4>
          <div className="space-y-1">
            {(() => {
              // Calculer la répartition par laboratoire
              const labCounts: Record<string, number> = {};
              topProductsData.forEach(product => {
                labCounts[product.laboratory] = (labCounts[product.laboratory] || 0) + 1;
              });
              
              // Trier par nombre de produits
              return Object.entries(labCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([lab, count], index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{lab}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count} produit{count > 1 ? 's' : ''}
                    </span>
                  </div>
                ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}