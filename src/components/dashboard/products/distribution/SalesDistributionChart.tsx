// src/components/dashboard/products/distribution/SalesDistributionChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { useSalesDistributionData } from './useSalesDistributionData';
import { Product } from '../ProductResultTable';

interface SalesDistributionChartProps {
  product: Product;
  type: 'category' | 'laboratory'; // Le type d'analyse à afficher
}

export function SalesDistributionChart({ product, type }: SalesDistributionChartProps) {
  const { data, isLoading, error } = useSalesDistributionData(product, type);
  
  if (isLoading) return <LoadingState height="40" message={`Chargement des données de distribution ${type === 'category' ? 'par catégorie' : 'par laboratoire'}...`} />;
  if (error) return <ErrorState message={error} />;
  
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', '#D97706', '#EF4444'];
  
  // Formater les labels du tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.value} {data.unit || 'ventes'} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Distribution des ventes par {type === 'category' ? 'catégorie' : 'laboratoire'}
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        {product.name} représente <span className="font-bold">{data.find(item => item.isCurrentProduct)?.percentage}%</span> des ventes {type === 'category' ? 'de sa catégorie' : 'de son laboratoire'}
      </div>
    </div>
  );
}