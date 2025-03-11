// src/components/dashboard/labs/visualization/SegmentSalesChart.tsx
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SegmentType } from './useSegmentData';

interface SegmentSalesData {
  name: string;
  count: number;
  sales: number;
  revenue: number;
  color?: string;
}

interface SegmentSalesChartProps {
  segmentSalesData: SegmentSalesData[];
  segmentType: SegmentType;
}

// Mapper le type de segment à un titre lisible
const segmentTitles: Record<SegmentType, string> = {
  'universe': 'Univers',
  'category': 'Catégories',
  'family': 'Familles',
  'range': 'Gammes'
};

export function SegmentSalesChart({ segmentSalesData, segmentType }: SegmentSalesChartProps) {
  const [displayMode, setDisplayMode] = useState<'sales' | 'revenue'>('sales');
  
  // Limiter le nombre de segments affichés pour la lisibilité
  const chartData = segmentSalesData
    .sort((a, b) => displayMode === 'sales' ? b.sales - a.sales : b.revenue - a.revenue)
    .slice(0, 10); // Prendre les 10 premiers segments
  
  // Formater les valeurs pour l'affichage
  const formatValue = (value: number) => {
    if (displayMode === 'revenue') {
      return `${value.toFixed(2)} €`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top 10 {segmentTitles[segmentType]} par {displayMode === 'sales' ? 'Ventes' : 'Chiffre d\'affaires'}
        </h3>
        
        <div className="flex">
          <button
            onClick={() => setDisplayMode('sales')}
            className={`px-3 py-1 text-sm rounded-l-md ${
              displayMode === 'sales'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Ventes
          </button>
          <button
            onClick={() => setDisplayMode('revenue')}
            className={`px-3 py-1 text-sm rounded-r-md ${
              displayMode === 'revenue'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            CA
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: any) => [formatValue(value), displayMode === 'sales' ? 'Ventes' : 'CA']}
              labelFormatter={(label) => `${segmentType}: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey={displayMode} 
              name={displayMode === 'sales' ? 'Ventes' : 'Chiffre d\'affaires'} 
              fill="#4F46E5"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <rect 
                  key={`bar-${index}`} 
                  fill={entry.color || '#4F46E5'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
        Les données sont basées sur {segmentSalesData.length} {segmentTitles[segmentType].toLowerCase()}
      </div>
    </div>
  );
}