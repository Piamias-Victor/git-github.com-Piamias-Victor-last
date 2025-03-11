// src/components/dashboard/charts/StockChart.tsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { SummaryCard } from '../products/summaries/SummaryCard';

interface StockData {
  date: string;
  stock: number;
  stockValue: number;
  stockouts: number;
}

interface StockChartProps {
  data: StockData[];
  isLoading: boolean;
  error: string | null;
  startDate: string;
  endDate: string;
}

export function StockChart({ data, isLoading, error, startDate, endDate }: StockChartProps) {
  // Vérifier et assurer que les données contiennent des ruptures - déplacé en dehors des conditions
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // S'assurer que chaque entrée de données a la propriété stockouts
    return data.map(item => ({
      ...item,
      stockouts: item.stockouts || 0
    }));
  }, [data]);

  // Définition des séries pour les graphiques - déplacé en dehors des conditions
  const stockSeries = [
    { dataKey: "stock", name: "Quantité en stock", color: "#4F46E5" },
    { dataKey: "stockValue", name: "Valeur du stock (€)", color: "#10B981" },
    { dataKey: "stockouts", name: "Produits en rupture", color: "#EF4444" }
  ];

  // Calcul des statistiques pour les SummaryCards - déplacé en dehors des conditions
  const metrics = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;

    // Calculer le stock moyen
    const avgStock = processedData.reduce((sum, item) => sum + item.stock, 0) / processedData.length;
    
    // Calculer le montant de stock moyen
    const avgStockValue = processedData.reduce((sum, item) => sum + item.stockValue, 0) / processedData.length;
    
    // Calculer le total des ruptures
    const totalStockouts = processedData.reduce((sum, item) => sum + (item.stockouts || 0), 0);
    
    // Définir un seuil de stock mini recommandé
    const minStockThreshold = 20;

    return {
      avgStock: Math.round(avgStock),
      avgStockValue: avgStockValue.toFixed(2),
      totalStockouts,
      minStockThreshold
    };
  }, [processedData]);

  // Maintenant les conditions
  if (isLoading) return <LoadingState height="60" message="Génération des graphiques d'analyse de stock..." />;
  if (error) return <ErrorState message={error} />;

  // Formatage personnalisé pour le tooltip
  const formatTooltipValue = (value: number | string, name: string) => {
    switch (name) {
      case 'stockouts':
        return [value, 'Produits en rupture'];
      case 'stock':
        return [value, 'Quantité en stock'];
      case 'stockValue':
        return [`${value} €`, 'Valeur du stock'];
      default:
        return [value, name];
    }
  };

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
            data={processedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatChartDate}
              stroke="#6B7280"
            />
            <YAxis 
              yAxisId="left"
              stroke="#6B7280"
              domain={[0, 'auto']}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6B7280"
              domain={[0, 'auto']}
            />
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
              dataKey="stockValue" 
              name="Valeur du stock (€)" 
              fill="#10B981" 
              yAxisId="right"
            />
            <Bar 
              dataKey="stockouts" 
              name="Produits en rupture" 
              fill="#EF4444" 
              yAxisId="left"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
        Niveaux de stock moyens par mois entre {formatDisplayDate(startDate)} et {formatDisplayDate(endDate)}
      </div>
      
      {/* Ajout des SummaryCards pour les métriques de stock */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <SummaryCard
            title="Stock Moyen"
            description="Moyenne des stocks"
            value={metrics.avgStock.toString()}
            icon="inbox"
            colorScheme="blue"
            filterType="stock"
            filterValue="average"
          />
          
          <SummaryCard
            title="Montant Stock Moyen"
            description="Valeur moyenne du stock"
            value={`${metrics.avgStockValue} €`}
            icon="trending-up"
            colorScheme="emerald"
            filterType="stock"
            filterValue="value-average"
          />
          
          <SummaryCard
            title="Quantité de Rupture"
            description="Total des produits en rupture"
            value={metrics.totalStockouts.toString()}
            icon="alert"
            colorScheme={
              metrics.totalStockouts === 0 ? "green" : 
              metrics.totalStockouts < 3 ? "amber" : "red"
            }
            filterType="stock"
            filterValue="stockouts"
          />
          
          <SummaryCard
            title="Seuil de Stock Mini"
            description="Stock minimum recommandé"
            value={`${metrics.minStockThreshold} unités`}
            icon="check-circle"
            colorScheme="blue"
            filterType="stock"
            filterValue="min-threshold"
          />
        </div>
      )}
    </div>
  );
}