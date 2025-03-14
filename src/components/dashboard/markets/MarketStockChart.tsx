// src/components/dashboard/markets/charts/MarketStockChart.tsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LoadingState } from '@/components/ui/LoadingState';

interface MarketStockChartProps {
  segment: MarketSegment;
  products: Product[];
  isLoading?: boolean;
}

export function MarketStockChart({ segment, products, isLoading = false }: MarketStockChartProps) {
  // Générer les données de stock pour le graphique
  const stockData = useMemo(() => {
    if (products.length === 0) return [];
    
    // Regrouper les produits par catégorie
    const categoriesMap: Record<string, { stock: number, value: number, count: number }> = {};
    
    products.forEach(product => {
      const category = product.category;
      
      if (!categoriesMap[category]) {
        categoriesMap[category] = {
          stock: 0,
          value: 0,
          count: 0
        };
      }
      
      categoriesMap[category].stock += product.stock;
      categoriesMap[category].value += product.stock * parseFloat(product.price);
      categoriesMap[category].count += 1;
    });
    
    // Convertir en tableau pour le graphique
    return Object.entries(categoriesMap).map(([category, data]) => ({
      name: category,
      stock: data.stock,
      value: data.value,
      avgPerProduct: data.stock / data.count
    }));
  }, [products]);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des données de stock..." />;
  }

  // Si aucun produit
  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun produit trouvé pour ce segment.
      </div>
    );
  }

  // Trouver les catégories avec le plus et le moins de stock
  const sortedByStock = [...stockData].sort((a, b) => b.stock - a.stock);
  const highestStockCategory = sortedByStock[0]?.name || '';
  const lowestStockCategory = sortedByStock[sortedByStock.length - 1]?.name || '';

  // Formater les valeurs monétaires
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculer le total des stocks
  const totalStock = stockData.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = stockData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
        Répartition des stocks par catégorie
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={stockData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6B7280"
              label={{ value: 'Quantité', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#10B981"
              label={{ value: 'Valeur (€)', angle: 90, position: 'insideRight' }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => {
                if (name === 'stock') return [value, 'Quantité'];
                if (name === 'value') return [formatCurrency(value), 'Valeur'];
                if (name === 'avgPerProduct') return [value.toFixed(2), 'Moy/produit'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="stock" name="Quantité" fill="#4F46E5" barSize={30} />
            <Line yAxisId="right" type="monotone" dataKey="value" name="Valeur (€)" stroke="#10B981" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="avgPerProduct" name="Moy/produit" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Résumé des stocks
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Le segment {segment.name} compte actuellement <span className="font-semibold">{totalStock} unités</span> en stock 
            pour une valeur totale de <span className="font-semibold">{formatCurrency(totalValue)}</span>.
          </p>
          <div className="mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Stock moyen par produit: {(totalStock / products.length).toFixed(2)} unités
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Répartition par catégorie
          </h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Catégorie avec le plus de stock: <span className="font-semibold">{highestStockCategory}</span>
            </p>
            <p>
              Catégorie avec le moins de stock: <span className="font-semibold">{lowestStockCategory}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}