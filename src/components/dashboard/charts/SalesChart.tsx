// src/components/dashboard/products/charts/SalesChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';

interface SalesChartProps {
  data: any[];
  isLoading: boolean;
  error: string | null;
  startDate: string;
  endDate: string;
}

export function SalesChart({ data, isLoading, error, startDate, endDate }: SalesChartProps) {
  if (isLoading) return <LoadingState height="60" message="Génération des graphiques d'analyse globale..." />;
  if (error) return <ErrorState message={error} />;

  // Définition des séries pour les graphiques
  const salesSeries = [
    { dataKey: "quantity", name: "Quantité vendue", color: "#4F46E5" },
    { dataKey: "revenue", name: "CA (€)", color: "#10B981" },
    { dataKey: "margin", name: "Marge (€)", color: "#F59E0B" }
  ];

  return (
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
  );
}