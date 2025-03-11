// src/components/dashboard/products/ProductSalesChart.tsx
import React, { useEffect, useState } from 'react';
import { useDateRange } from '@/providers/DateRangeProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { generateSalesData } from '@/utils/productDataUtils';
import { ProductSalesData } from '../../../../types/product';
import { ChartLegend } from '../charts/ChartLegend';


interface ProductSalesChartProps {
  productId: string;
  productCode: string; // code_13_ref
}

export function ProductSalesChart({ productId, productCode }: ProductSalesChartProps) {
  const { startDate, endDate } = useDateRange();
  const [salesData, setSalesData] = useState<ProductSalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateSalesData(productId, startDate, endDate);
        setSalesData(mockData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de vente:', err);
        setError('Impossible de charger les données de vente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && startDate && endDate) {
      fetchSalesData();
    }
  }, [productId, startDate, endDate]);

  if (isLoading) return <LoadingState height="60" />;
  if (error) return <ErrorState message={error} />;

  // Définition des séries à afficher
  const series = [
    { dataKey: "quantity", name: "Quantité", color: "#4F46E5" },
    { dataKey: "revenue", name: "CA (€)", color: "#10B981" },
    { dataKey: "margin", name: "Marge (€)", color: "#F59E0B" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Évolution des ventes - 6 derniers mois
        </h3>
        <ChartLegend series={series} />
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
              formatter={formatTooltipValue}
              labelFormatter={formatTooltipDate}
            />
            {series.map(serie => (
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
        Les données sont basées sur les ventes enregistrées entre {formatDisplayDate(startDate)} et {formatDisplayDate(endDate)}
      </div>
    </div>
  );
}

// Formatteur pour les valeurs dans les tooltips
function formatTooltipValue(value: number, name: string) {
  const labels = {
    'quantity': 'Quantité',
    'revenue': 'CA (€)',
    'margin': 'Marge (€)'
  };
  return [`${value}`, labels[name as keyof typeof labels] || name];
}