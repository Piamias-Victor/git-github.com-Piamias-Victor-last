// src/components/dashboard/products/charts/StockChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';

interface StockChartProps {
  data: any[];
  isLoading: boolean;
  error: string | null;
  startDate: string;
  endDate: string;
}

export function StockChart({ data, isLoading, error, startDate, endDate }: StockChartProps) {
  if (isLoading) return <LoadingState height="60" />;
  if (error) return <ErrorState message={error} />;

  // Définition des séries pour les graphiques
  const stockSeries = [
    { dataKey: "stock", name: "Quantité en stock", color: "#4F46E5" },
    { dataKey: "stockValue", name: "Valeur du stock (€)", color: "#10B981" }
  ];

  return (
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
            data={data}
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
  );
}