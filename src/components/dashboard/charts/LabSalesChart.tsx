// src/components/dashboard/charts/LabSalesChart.tsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { SummaryCard } from '../products/summaries/SummaryCard';
import { Laboratory } from '../labs/LabResultTable';

interface LabSalesData {
  date: string;
  sellOut: number;
  sellIn: number;
  totalProducts: number;
}

interface LabSalesChartProps {
  laboratories: Laboratory[];
  isLoading?: boolean;
  error?: string | null;
  startDate: string;
  endDate: string;
}

export function LabSalesChart({ 
  laboratories, 
  isLoading = false, 
  error = null, 
  startDate, 
  endDate 
}: LabSalesChartProps) {
  // Générer des données simulées basées sur les laboratoires sélectionnés
  const generateMockLabSalesData = (labs: Laboratory[]): LabSalesData[] => {
    // Créer des données pour 6 mois
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'
    ];

    return months.map((month, index) => {
      // Calculer les sommes pour tous les laboratoires sélectionnés
      const totalSellOut = labs.reduce((sum, lab) => {
        // Ajouter une variation aléatoire pour simuler des tendances
        const variation = 0.9 + Math.random() * 0.2; // +/- 10%
        return sum + (lab.revenue.sellOut * variation);
      }, 0);

      const totalSellIn = labs.reduce((sum, lab) => {
        const variation = 0.9 + Math.random() * 0.2;
        return sum + (lab.revenue.sellIn * variation);
      }, 0);

      const totalProducts = labs.reduce((sum, lab) => sum + lab.products, 0);

      return {
        date: `2025-${String(index + 1).padStart(2, '0')}-01`,
        sellOut: Math.round(totalSellOut),
        sellIn: Math.round(totalSellIn),
        totalProducts
      };
    });
  };

  // Générer les données du graphique
  const data = useMemo(() => {
    if (laboratories.length > 0) {
      return generateMockLabSalesData(laboratories);
    }
    return [];
  }, [laboratories]);

  // Définition des séries pour les graphiques
  const salesSeries = [
    { dataKey: "sellOut", name: "Sell-out (€)", color: "#4F46E5" },
    { dataKey: "sellIn", name: "Sell-in (€)", color: "#10B981" },
    { dataKey: "totalProducts", name: "Nombre de produits", color: "#F59E0B" }
  ];

  // Calcul des statistiques pour les SummaryCards
  const metrics = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Calcul de la somme totale pour chaque métrique
    const totalSellOut = data.reduce((sum, item) => sum + item.sellOut, 0);
    const totalSellIn = data.reduce((sum, item) => sum + item.sellIn, 0);
    const totalProducts = data.reduce((sum, item) => sum + item.totalProducts, 0);
    
    // Calcul du taux de croissance
    const lastMonthIndex = data.length - 1;
    const lastMonth = data[lastMonthIndex];
    
    // Vérifier qu'il y a suffisamment de données
    if (lastMonthIndex <= 0) {
      return {
        totalSellOut: totalSellOut.toFixed(0),
        totalSellIn: totalSellIn.toFixed(0),
        averageProducts: (totalProducts / data.length).toFixed(0),
        sellOutTrend: "0.0",
        sellInTrend: "0.0",
        productsTrend: "0.0",
      };
    }
    
    // Calculer les moyennes des mois précédents
    const previousMonths = data.slice(0, lastMonthIndex);
    const avgSellOut = previousMonths.reduce((sum, item) => sum + item.sellOut, 0) / previousMonths.length;
    const avgSellIn = previousMonths.reduce((sum, item) => sum + item.sellIn, 0) / previousMonths.length;
    const avgProducts = previousMonths.reduce((sum, item) => sum + item.totalProducts, 0) / previousMonths.length;
    
    // Calculer les tendances en pourcentage
    const sellOutTrend = ((lastMonth.sellOut - avgSellOut) / avgSellOut) * 100;
    const sellInTrend = ((lastMonth.sellIn - avgSellIn) / avgSellIn) * 100;
    const productsTrend = ((lastMonth.totalProducts - avgProducts) / avgProducts) * 100;
    
    return {
      totalSellOut: totalSellOut.toFixed(0),
      totalSellIn: totalSellIn.toFixed(0),
      averageProducts: (totalProducts / data.length).toFixed(0),
      sellOutTrend: sellOutTrend.toFixed(1),
      sellInTrend: sellInTrend.toFixed(1),
      productsTrend: productsTrend.toFixed(1),
    };
  }, [data]);

  // Vérifications de chargement et d'erreur
  if (isLoading) return <LoadingState height="60" message="Génération des graphiques de laboratoires..." />;
  if (error) return <ErrorState message={error} />;

  // Si aucun laboratoire n'est sélectionné
  if (laboratories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Sélectionnez des laboratoires pour afficher les graphiques
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Performance des laboratoires - Cumul {laboratories.map(l => l.name).join(', ')}
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
              formatter={(value: number | string) => [`${value}`, '']}
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
        Données simulées entre {formatDisplayDate(startDate)} et {formatDisplayDate(endDate)}
      </div>
      
      {/* Ajout des SummaryCards pour les métriques de laboratoires */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <SummaryCard
            title="Sell-out total"
            description={`Tendance: ${Number(metrics.sellOutTrend) >= 0 ? '+' : ''}${metrics.sellOutTrend}%`}
            value={`${metrics.totalSellOut} €`}
            icon="chart-line"
            colorScheme="blue"
            filterType="sales"
            filterValue="sellout"
          />
          
          <SummaryCard
            title="Sell-in total"
            description={`Tendance: ${Number(metrics.sellInTrend) >= 0 ? '+' : ''}${metrics.sellInTrend}%`}
            value={`${metrics.totalSellIn} €`}
            icon="trending-up"
            colorScheme={Number(metrics.sellInTrend) >= 0 ? "emerald" : "red"}
            filterType="sales"
            filterValue="sellin"
          />
          
          <SummaryCard
            title="Produits"
            description={`Tendance: ${Number(metrics.productsTrend) >= 0 ? '+' : ''}${metrics.productsTrend}%`}
            value={metrics.averageProducts}
            icon="grid"
            colorScheme={Number(metrics.productsTrend) >= 0 ? "green" : "amber"}
            filterType="labs"
            filterValue="products"
          />
          
          <SummaryCard
            title="Labs sélectionnés"
            description="Nombre de laboratoires"
            value={`${laboratories.length}`}
            icon="check-circle"
            colorScheme="blue"
            filterType="labs"
            filterValue="count"
          />
        </div>
      )}
    </div>
  );
}