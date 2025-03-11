// src/components/dashboard/charts/StockChart.tsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { SummaryCard } from '../products/summaries/SummaryCard';

interface StockChartProps {
  data: any[];
  isLoading: boolean;
  error: string | null;
  startDate: string;
  endDate: string;
}

export function StockChart({ data, isLoading, error, startDate, endDate }: StockChartProps) {
  if (isLoading) return <LoadingState height="60" message="Génération des graphiques d'analyse de stock..." />;
  if (error) return <ErrorState message={error} />;

  // Vérifier et assurer que les données contiennent des ruptures
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // S'assurer que chaque entrée de données a la propriété stockouts
    return data.map(item => ({
      ...item,
      stockouts: item.stockouts || 0
    }));
  }, [data]);

  // Log pour débogage
  console.log("StockChart: Données traitées", processedData);

  // Définition des séries pour les graphiques
  const stockSeries = [
    { dataKey: "stock", name: "Quantité en stock", color: "#4F46E5" },
    { dataKey: "stockValue", name: "Valeur du stock (€)", color: "#10B981" },
    { dataKey: "stockouts", name: "Produits en rupture", color: "#EF4444" }
  ];

  // Calcul des statistiques pour les SummaryCards
  const metrics = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;

    // Obtenir les données du mois le plus récent
    const latestMonth = processedData[processedData.length - 1];
    
    // Calculer la valeur totale moyenne du stock
    const avgStockValue = processedData.reduce((sum, item) => sum + item.stockValue, 0) / processedData.length;
    
    // Calculer le stock moyen
    const avgStock = processedData.reduce((sum, item) => sum + item.stock, 0) / processedData.length;
    
    // Calculer les tendances
    const previousMonth = processedData.length > 1 ? processedData[processedData.length - 2] : null;
    
    let stockTrend = 0;
    let valueTrend = 0;
    
    if (previousMonth) {
      stockTrend = ((latestMonth.stock - previousMonth.stock) / previousMonth.stock) * 100;
      valueTrend = ((latestMonth.stockValue - previousMonth.stockValue) / previousMonth.stockValue) * 100;
    }
    
    // Calculer le nombre total de produits en rupture
    const totalStockouts = processedData.reduce((sum, item) => sum + (item.stockouts || 0), 0);
    
    // Estimer les jours de couverture (en supposant que les ventes mensuelles sont approximativement le stock / 2)
    // Cela devrait être remplacé par un calcul basé sur les données réelles de vente dans une app complète
    const estimatedMonthlySales = latestMonth.stock / 2;
    const coverageDays = estimatedMonthlySales > 0 ? Math.round((latestMonth.stock / estimatedMonthlySales) * 30) : 0;
    
    // Calculer le taux de rotation (estimé)
    const turnoverRate = estimatedMonthlySales / latestMonth.stock;
    
    // Obtenir le nombre de produits en rupture actuellement
    const currentStockouts = latestMonth.stockouts || 0;
    
    // Calculer la tendance des ruptures
    let stockoutTrend = 0;
    if (previousMonth && previousMonth.stockouts > 0) {
      stockoutTrend = ((currentStockouts - previousMonth.stockouts) / previousMonth.stockouts) * 100;
    }
    
    return {
      currentStock: latestMonth.stock,
      currentValue: latestMonth.stockValue.toFixed(2),
      stockTrend: stockTrend.toFixed(1),
      valueTrend: valueTrend.toFixed(1),
      avgStockValue: avgStockValue.toFixed(2),
      coverageDays,
      turnoverRate: turnoverRate.toFixed(2),
      totalStockouts,
      currentStockouts,
      stockoutTrend: stockoutTrend.toFixed(1)
    };
  }, [processedData]);

  // Formatage personnalisé pour le tooltip
  const formatTooltipValue = (value: any, name: string) => {
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          <SummaryCard
            title="Stock actuel"
            description={`Tendance: ${Number(metrics.stockTrend) >= 0 ? '+' : ''}${metrics.stockTrend}%`}
            value={metrics.currentStock.toString()}
            icon="inbox"
            colorScheme="blue"
            filterType="stock"
            filterValue="current"
          />
          
          <SummaryCard
            title="Valeur du stock"
            description={`Tendance: ${Number(metrics.valueTrend) >= 0 ? '+' : ''}${metrics.valueTrend}%`}
            value={`${metrics.currentValue} €`}
            icon="trending-up"
            colorScheme={Number(metrics.valueTrend) > 5 ? "amber" : Number(metrics.valueTrend) < -5 ? "emerald" : "blue"}
            filterType="stock"
            filterValue="value"
          />
          
          <SummaryCard
            title="Produits en rupture"
            description={`Tendance: ${Number(metrics.stockoutTrend) >= 0 ? '+' : ''}${metrics.stockoutTrend}%`}
            value={metrics.currentStockouts.toString()}
            icon="alert-triangle"
            colorScheme={
              metrics.currentStockouts === 0 ? "green" : 
              metrics.currentStockouts < 3 ? "amber" : "red"
            }
            filterType="stock"
            filterValue="stockouts"
          />
          
          <SummaryCard
            title="Couverture"
            description="Estimation en jours"
            value={`${metrics.coverageDays} jours`}
            icon="check-circle"
            colorScheme={
              metrics.coverageDays < 15 ? "red" : 
              metrics.coverageDays < 30 ? "amber" : 
              metrics.coverageDays > 60 ? "amber" : "green"
            }
            filterType="stock"
            filterValue="coverage"
          />
          
          <SummaryCard
            title="Taux de rotation"
            description="Rotations par mois"
            value={`${metrics.turnoverRate}x`}
            icon="refresh-cw"
            colorScheme={
              Number(metrics.turnoverRate) < 0.5 ? "red" : 
              Number(metrics.turnoverRate) < 1 ? "amber" : 
              Number(metrics.turnoverRate) > 3 ? "green" : "emerald"
            }
            filterType="stock"
            filterValue="turnover"
          />
        </div>
      )}
    </div>
  );
}