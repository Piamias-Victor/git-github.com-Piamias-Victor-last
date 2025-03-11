// src/components/dashboard/charts/LabStockChart.tsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { ChartLegend } from '@/components/dashboard/charts/ChartLegend';
import { formatChartDate, formatTooltipDate, formatDisplayDate } from '@/utils/dateFormatUtils';
import { SummaryCard } from '../products/summaries/SummaryCard';
import { Laboratory } from '../labs/LabResultTable';

interface LabStockData {
  date: string;
  totalStock: number;
  stockValue: number;
  lowStockProducts: number;
}

interface LabStockChartProps {
  laboratories: Laboratory[];
  isLoading?: boolean;
  error?: string | null;
  startDate: string;
  endDate: string;
}

export function LabStockChart({ 
  laboratories, 
  isLoading = false, 
  error = null, 
  startDate, 
  endDate 
}: LabStockChartProps) {
  // Générer des données simulées basées sur les laboratoires sélectionnés
  const generateMockLabStockData = (labs: Laboratory[]): LabStockData[] => {
    // Créer des données pour 6 mois
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'
    ];

    return months.map((month, index) => {
      // Calculer les totaux pour tous les laboratoires sélectionnés
      const totalStock = labs.reduce((sum, lab) => {
        // Simuler un nombre de produits multiplié par un stock moyen
        const variation = 0.9 + Math.random() * 0.2; // +/- 10%
        return sum + (lab.products * 10 * variation);
      }, 0);

      const stockValue = labs.reduce((sum, lab) => {
        // Valeur moyenne de stock basée sur le prix et le nombre de produits
        const avgProductPrice = 50; // Prix moyen estimé
        const variation = 0.9 + Math.random() * 0.2;
        return sum + (lab.products * avgProductPrice * variation);
      }, 0);

      const lowStockProducts = labs.reduce((sum, lab) => {
        // Simuler un nombre de produits en stock critique
        const variation = Math.random();
        return sum + Math.floor(lab.products * (variation * 0.3));
      }, 0);

      return {
        date: `2025-${String(index + 1).padStart(2, '0')}-01`,
        totalStock: Math.round(totalStock),
        stockValue: Math.round(stockValue),
        lowStockProducts: Math.round(lowStockProducts)
      };
    });
  };

  // Générer les données du graphique
  const data = useMemo(() => {
    if (laboratories.length > 0) {
      return generateMockLabStockData(laboratories);
    }
    return [];
  }, [laboratories]);

  // Définition des séries pour les graphiques
  const stockSeries = [
    { dataKey: "totalStock", name: "Quantité totale en stock", color: "#4F46E5" },
    { dataKey: "stockValue", name: "Valeur du stock (€)", color: "#10B981" },
    { dataKey: "lowStockProducts", name: "Produits à stock critique", color: "#EF4444" }
  ];

  // Calcul des statistiques pour les SummaryCards
  const metrics = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Calcul de la somme totale pour chaque métrique
    const totalStock = data.reduce((sum, item) => sum + item.totalStock, 0);
    const totalStockValue = data.reduce((sum, item) => sum + item.stockValue, 0);
    const totalLowStockProducts = data.reduce((sum, item) => sum + item.lowStockProducts, 0);
    
    // Calcul du taux de croissance
    const lastMonthIndex = data.length - 1;
    const lastMonth = data[lastMonthIndex];
    
    // Vérifier qu'il y a suffisamment de données
    if (lastMonthIndex <= 0) {
      return {
        avgStock: (totalStock / data.length).toFixed(0),
        avgStockValue: (totalStockValue / data.length).toFixed(0),
        avgLowStockProducts: (totalLowStockProducts / data.length).toFixed(0),
        stockTrend: "0.0",
        stockValueTrend: "0.0",
        lowStockTrend: "0.0",
      };
    }
    
    // Calculer les moyennes des mois précédents
    const previousMonths = data.slice(0, lastMonthIndex);
    const avgPrevStock = previousMonths.reduce((sum, item) => sum + item.totalStock, 0) / previousMonths.length;
    const avgPrevStockValue = previousMonths.reduce((sum, item) => sum + item.stockValue, 0) / previousMonths.length;
    const avgPrevLowStock = previousMonths.reduce((sum, item) => sum + item.lowStockProducts, 0) / previousMonths.length;
    
    // Calculer les tendances en pourcentage
    const stockTrend = ((lastMonth.totalStock - avgPrevStock) / avgPrevStock) * 100;
    const stockValueTrend = ((lastMonth.stockValue - avgPrevStockValue) / avgPrevStockValue) * 100;
    const lowStockTrend = ((lastMonth.lowStockProducts - avgPrevLowStock) / avgPrevLowStock) * 100;
    
    return {
      avgStock: (totalStock / data.length).toFixed(0),
      avgStockValue: (totalStockValue / data.length).toFixed(0),
      avgLowStockProducts: (totalLowStockProducts / data.length).toFixed(0),
      stockTrend: stockTrend.toFixed(1),
      stockValueTrend: stockValueTrend.toFixed(1),
      lowStockTrend: lowStockTrend.toFixed(1),
    };
  }, [data]);

  // Vérifications de chargement et d'erreur
  if (isLoading) return <LoadingState height="60" message="Génération des graphiques de stocks de laboratoires..." />;
  if (error) return <ErrorState message={error} />;

  // Si aucun laboratoire n'est sélectionné
  if (laboratories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Sélectionnez des laboratoires pour afficher les graphiques de stocks
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Gestion des stocks - {laboratories.map(l => l.name).join(', ')}
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
              formatter={(value: number, name: string) => [value, '']}
              labelFormatter={formatTooltipDate}
            />
            <Bar 
              dataKey="totalStock" 
              name="Quantité totale en stock" 
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
              dataKey="lowStockProducts" 
              name="Produits à stock critique" 
              fill="#EF4444" 
              yAxisId="left"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
        Analyse des stocks entre {formatDisplayDate(startDate)} et {formatDisplayDate(endDate)}
      </div>
      
      {/* Ajout des SummaryCards pour les métriques de stock */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <SummaryCard
            title="Stock Moyen"
            description="Quantité totale en stock"
            value={metrics.avgStock}
            icon="inbox"
            colorScheme="blue"
            filterType="stock"
            filterValue="total-average"
          />
          
          <SummaryCard
            title="Valeur Stock Moyen"
            description="Valeur totale du stock"
            value={`${metrics.avgStockValue} €`}
            icon="trending-up"
            colorScheme="emerald"
            filterType="stock"
            filterValue="value-average"
          />
          
          <SummaryCard
            title="Produits à Stock Critique"
            description="Moyenne des produits sous-stockés"
            value={metrics.avgLowStockProducts}
            icon="alert"
            colorScheme={
              parseFloat(metrics.avgLowStockProducts) === 0 ? "green" : 
              parseFloat(metrics.avgLowStockProducts) < 3 ? "amber" : "red"
            }
            filterType="stock"
            filterValue="low-stock"
          />
          
          <SummaryCard
            title="Laboratoires"
            description="Nombre de laboratoires"
            value={`${laboratories.length}`}
            icon="grid"
            colorScheme="blue"
            filterType="labs"
            filterValue="count"
          />
        </div>
      )}
    </div>
  );
}