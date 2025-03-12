// src/components/dashboard/markets/charts/MarketSalesChart.tsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { LoadingState } from '@/components/ui/LoadingState';
import { formatChartDate } from '@/utils/dateFormatUtils';

interface MarketSalesChartProps {
  segments: MarketSegment[];
  startDate: string;
  endDate: string;
  isLoading?: boolean;
}

export function MarketSalesChart({ segments, startDate, endDate, isLoading = false }: MarketSalesChartProps) {
  // Génération de données simulées basées sur les segments
  const chartData = useMemo(() => {
    if (segments.length === 0) return [];
    
    // Définir les mois pour la période
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    
    // Si nous n'avons qu'un seul segment
    if (segments.length === 1) {
      return months.map((month, index) => {
        // Facteur de saisonnalité pour ajouter des variations
        const seasonalFactor = 0.8 + Math.sin(index / 5) * 0.4;
        
        // Calculer la valeur mensuelle basée sur le revenu du segment
        const monthlyValue = (segments[0].revenue / 6) * seasonalFactor;
        
        return {
          name: month,
          date: `2025-${String(index + 1).padStart(2, '0')}-01`,
          [segments[0].name]: monthlyValue
        };
      });
    }
    
    // Si nous avons plusieurs segments (maximum 5 pour la lisibilité)
    const topSegments = segments
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return months.map((month, index) => {
      const monthData: any = {
        name: month,
        date: `2025-${String(index + 1).padStart(2, '0')}-01`,
      };
      
      // Ajouter les données pour chaque segment
      topSegments.forEach(segment => {
        // Facteur de saisonnalité différent pour chaque segment
        const seasonalFactor = 0.8 + Math.sin((index + segment.id.length) / 5) * 0.4;
        
        // Calculer la valeur mensuelle
        monthData[segment.name] = (segment.revenue / 6) * seasonalFactor;
      });
      
      return monthData;
    });
  }, [segments]);

  // Couleurs pour les barres
  const colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#14B8A6', '#D97706', '#BE185D'
  ];

  // Formater les valeurs monétaires
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Génération des graphiques de ventes..." />;
  }

  // Si aucun segment
  if (segments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun segment sélectionné pour afficher les ventes
      </div>
    );
  }

  const segmentNames = segments.length === 1 
    ? [segments[0].name] 
    : segments.slice(0, 5).map(s => s.name);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
        {segments.length === 1 
          ? `Évolution des ventes - ${segments[0].name}` 
          : 'Comparaison des ventes par segment'}
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
            />
            <YAxis 
              stroke="#6B7280"
              tickFormatter={(value) => `${value / 1000}k€`}
            />
            <Tooltip 
              formatter={(value: any) => [formatCurrency(value), '']}
              labelFormatter={(label) => `${label} 2025`}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderColor: '#E5E7EB',
                color: '#111827',
              }}
            />
            <Legend />
            
            {segmentNames.map((name, index) => (
              <Bar 
                key={name}
                dataKey={name} 
                fill={colors[index % colors.length]} 
                name={name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Résumé des ventes
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {segments.length === 1
              ? `Les ventes de ${segments[0].name} sont en ${segments[0].growth.startsWith('-') ? 'baisse' : 'hausse'} de ${segments[0].growth.replace('+', '')} avec un total de ${formatCurrency(segments[0].revenue)}.`
              : `Le graphique présente l'évolution des ventes pour les ${Math.min(5, segments.length)} segments les plus importants, représentant en tout ${formatCurrency(segments.slice(0, 5).reduce((sum, s) => sum + s.revenue, 0))}.`
            }
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {segments.length === 1 ? 'Laboratoire dominant' : 'Répartition par laboratoire'}
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {segments.length === 1 && segments[0].dominantLab && segments[0].dominantLab !== 'N/A' ? (
              <div className="flex justify-between items-center">
                <span>{segments[0].dominantLab}</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  Leader de ce segment
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                {segments.slice(0, 3).map((segment, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{segment.name}</span>
                    <span>{segment.dominantLab && segment.dominantLab !== 'N/A' ? segment.dominantLab : 'Divers'}</span>
                  </div>
                ))}
                {segments.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    + {segments.length - 3} autres segments
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}