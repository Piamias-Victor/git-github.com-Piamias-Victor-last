// src/components/dashboard/products/ProductStockChart.tsx
import React, { useEffect, useState } from 'react';
import { useDateRange } from '@/providers/DateRangeProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateStockData } from '@/utils/productDataUtils';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { ErrorState, LoadingState } from '@/components/ui/LoadingState';
import { ProductStockData } from '../../../../types/product';


interface ProductStockChartProps {
  productId: string;
  productCode: string; // code_13_ref
}

export function ProductStockChart({ productId, productCode }: ProductStockChartProps) {
  const { startDate, endDate } = useDateRange();
  const [stockData, setStockData] = useState<ProductStockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateStockData(productId, startDate, endDate);
        setStockData(mockData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de stock:', err);
        setError('Impossible de charger les données de stock.');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && startDate && endDate) {
      fetchStockData();
    }
  }, [productId, startDate, endDate]);

  if (isLoading) return <LoadingState height="60" />;
  if (error) return <ErrorState message={error} />;

  // Définition des séries à afficher
  const series = [
    { dataKey: "stock", name: "Quantité en stock", color: "#4F46E5" },
    { dataKey: "value", name: "Valeur du stock (€)", color: "#10B981" },
    { dataKey: "stockouts", name: "Ruptures", color: "#EF4444" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Évolution du stock - 6 derniers mois
        </h3>
        <ChartLegend series={series} />
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
            <YAxis yAxisId="left" stroke="#6B7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderColor: '#E5E7EB',
                color: '#111827',
              }} 
              formatter={formatTooltipValue}
              labelFormatter={formatTooltipDate}
            />
            <Bar 
              dataKey="stock" 
              name="Quantité en stock" 
              fill="#4F46E5" 
              yAxisId="left"
            />
            <Bar 
              dataKey="value" 
              name="Valeur du stock (€)" 
              fill="#10B981" 
              yAxisId="right"
            />
            <Bar 
              dataKey="stockouts" 
              name="Ruptures" 
              fill="#EF4444" 
              yAxisId="left"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        L'historique du stock entre {formatDisplayDate(startDate)} et {formatDisplayDate(endDate)}
      </div>
    </div>
  );
}

// Formatteur pour les valeurs dans les tooltips
function formatTooltipValue(value: number, name: string) {
  const labels = {
    'stock': 'Quantité en stock',
    'value': 'Valeur du stock (€)',
    'stockouts': 'Ruptures'
  };
  return [`${value}`, labels[name as keyof typeof labels] || name];
}