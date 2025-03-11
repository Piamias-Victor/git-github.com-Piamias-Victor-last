// src/components/dashboard/charts/SalesChart.tsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { SummaryCard } from '../products/summaries/SummaryCard';

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

  // Calcul des statistiques pour les SummaryCards
  const metrics = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Calcul de la somme totale des quantités, revenus et marges
    const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalMargin = data.reduce((sum, item) => sum + item.margin, 0);
    
    // Calcul du taux de marge global
    const marginRate = (totalMargin / totalRevenue) * 100;
    
    // Calcul des tendances (comparaison du dernier mois avec la moyenne des mois précédents)
    const lastMonthIndex = data.length - 1;
    const lastMonth = data[lastMonthIndex];
    
    // Calculer les moyennes des mois précédents
    const previousMonths = data.slice(0, lastMonthIndex);
    const avgQuantity = previousMonths.reduce((sum, item) => sum + item.quantity, 0) / previousMonths.length;
    const avgRevenue = previousMonths.reduce((sum, item) => sum + item.revenue, 0) / previousMonths.length;
    const avgMargin = previousMonths.reduce((sum, item) => sum + item.margin, 0) / previousMonths.length;
    
    // Calculer les tendances en pourcentage
    const quantityTrend = ((lastMonth.quantity - avgQuantity) / avgQuantity) * 100;
    const revenueTrend = ((lastMonth.revenue - avgRevenue) / avgRevenue) * 100;
    const marginTrend = ((lastMonth.margin - avgMargin) / avgMargin) * 100;
    
    return {
      totalQuantity,
      totalRevenue: totalRevenue.toFixed(2),
      totalMargin: totalMargin.toFixed(2),
      marginRate: marginRate.toFixed(1),
      quantityTrend: quantityTrend.toFixed(1),
      revenueTrend: revenueTrend.toFixed(1),
      marginTrend: marginTrend.toFixed(1),
    };
  }, [data]);

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
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
        Données entre {formatDisplayDate(startDate)} et {formatDisplayDate(endDate)}
      </div>
      
      {/* Ajout des SummaryCards pour les métriques de ventes */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <SummaryCard
            title="Quantité vendue"
            description={`Tendance: ${Number(metrics.quantityTrend) >= 0 ? '+' : ''}${metrics.quantityTrend}%`}
            value={metrics.totalQuantity}
            icon="chart-line"
            colorScheme="blue"
            filterType="sales"
            filterValue="quantity"
          />
          
          <SummaryCard
            title="Chiffre d'affaires"
            description={`Tendance: ${Number(metrics.revenueTrend) >= 0 ? '+' : ''}${metrics.revenueTrend}%`}
            value={`${metrics.totalRevenue} €`}
            icon="trending-up"
            colorScheme={Number(metrics.revenueTrend) >= 0 ? "emerald" : "red"}
            filterType="sales"
            filterValue="revenue"
          />
          
          <SummaryCard
            title="Marge totale"
            description={`Tendance: ${Number(metrics.marginTrend) >= 0 ? '+' : ''}${metrics.marginTrend}%`}
            value={`${metrics.totalMargin} €`}
            icon="arrow-up"
            colorScheme={Number(metrics.marginTrend) >= 0 ? "green" : "amber"}
            filterType="sales"
            filterValue="margin"
          />
          
          <SummaryCard
            title="Taux de marge"
            description="Rapport marge/CA"
            value={`${metrics.marginRate}%`}
            icon="trending-up"
            colorScheme={Number(metrics.marginRate) >= 25 ? "green" : Number(metrics.marginRate) >= 20 ? "emerald" : "amber"}
            filterType="sales"
            filterValue="rate"
          />
        </div>
      )}
    </div>
  );
}