
// src/components/dashboard/markets/forecast/MarketAnnualForecast.tsx
import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { PeriodComparison } from '@/components/dashboard/metrics/PeriodComparison';
import { formatCurrency } from '@/utils/formatters';

interface MarketAnnualForecastProps {
  segment: MarketSegment;
  isLoading?: boolean;
}

export function MarketAnnualForecast({
  segment,
  isLoading = false
}: MarketAnnualForecastProps) {
  // Générer des données de prévisions simulées
  const forecastData = useMemo(() => {
    // Mois de l'année
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    
    // Générer des valeurs de vente mensuelles (sell-out) basées sur le revenu du segment
    const baseMonthlyRevenue = segment.revenue / 12;
    
    // Ajouter des facteurs de saisonnalité
    const seasonalityFactors = [
      0.85, // Jan
      0.80, // Fév
      0.90, // Mar
      0.95, // Avr
      1.00, // Mai
      1.05, // Juin
      0.95, // Juil
      0.75, // Août
      1.05, // Sep
      1.10, // Oct
      1.20, // Nov
      1.40  // Déc
    ];
    
    // Facteur de croissance extrait du taux de croissance du segment
    const growthRate = parseFloat(segment.growth.replace('%', '').replace('+', '')) / 100;
    const growthFactor = 1 + (growthRate / 12); // Croissance mensuelle
    
    // Date actuelle pour déterminer le mois courant
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Générer les données pour chaque mois
    return months.map((month, index) => {
      // Appliquer les facteurs de saisonnalité et de croissance
      const seasonalFactor = seasonalityFactors[index];
      const monthFactor = Math.pow(growthFactor, index - currentMonth);
      
      // Calculer les ventes réelles et prévisionnelles
      const actualSellOut = index <= currentMonth 
        ? baseMonthlyRevenue * seasonalFactor * (1 + (Math.random() * 0.2 - 0.1)) 
        : 0;
        
      const actualSellIn = index <= currentMonth 
        ? actualSellOut * (1 + (Math.random() * 0.2 - 0.1)) 
        : 0;
        
      const projectedSellOut = baseMonthlyRevenue * seasonalFactor * monthFactor;
      const projectedSellIn = projectedSellOut * (1.05 + (Math.random() * 0.1));
      
      return {
        name: month,
        month: index + 1,
        sellOut: actualSellOut,
        sellIn: actualSellIn,
        projectedSellOut: projectedSellOut,
        projectedSellIn: projectedSellIn
      };
    });
  }, [segment]);

  // Calculer les statistiques annuelles
  const annualStats = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Calculer les totaux pour l'année courante jusqu'au mois actuel
    const currentSellOut = forecastData
      .filter(d => d.month <= currentMonth + 1)
      .reduce((sum, d) => sum + d.sellOut, 0);
    
    const currentSellIn = forecastData
      .filter(d => d.month <= currentMonth + 1)
      .reduce((sum, d) => sum + d.sellIn, 0);
    
    // Calculer les projections pour l'année complète
    const projectedSellOut = forecastData.reduce((sum, d) => {
      if (d.month <= currentMonth + 1) {
        return sum + d.sellOut;
      }
      return sum + d.projectedSellOut;
    }, 0);
    
    const projectedSellIn = forecastData.reduce((sum, d) => {
      if (d.month <= currentMonth + 1) {
        return sum + d.sellIn;
      }
      return sum + d.projectedSellIn;
    }, 0);
    
    // Simuler les données de l'année précédente (avec un facteur basé sur le taux de croissance)
    const growthRate = parseFloat(segment.growth.replace('%', '').replace('+', '')) / 100;
    const lastYearFactor = 1 / (1 + growthRate);
    
    const lastYearSellOut = currentSellOut * lastYearFactor;
    const lastYearSellIn = currentSellIn * lastYearFactor;
    const lastYearTotalSellOut = projectedSellOut * lastYearFactor;
    const lastYearTotalSellIn = projectedSellIn * lastYearFactor;
    
    return {
      currentSellOut,
      currentSellIn,
      projectedSellOut,
      projectedSellIn,
      lastYearSellOut,
      lastYearSellIn,
      lastYearTotalSellOut,
      lastYearTotalSellIn
    };
  }, [forecastData, segment.growth]);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des prévisions en cours..." />;
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Prévisions Annuelles {new Date().getFullYear()}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{Math.round(((new Date().getMonth() + 1) / 12) * 100)}%</span> de l'année écoulée
          </div>
        </div>

        {/* Statistiques de prévision */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sell-out réalisé</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(annualStats.currentSellOut)}
            </div>
            <PeriodComparison 
              currentValue={annualStats.currentSellOut} 
              previousValue={annualStats.lastYearSellOut}
              precision={1}
              format="percentage"
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sell-out prévisionnel</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {formatCurrency(annualStats.projectedSellOut)}
            </div>
            <PeriodComparison 
              currentValue={annualStats.projectedSellOut} 
              previousValue={annualStats.lastYearTotalSellOut}
              precision={1}
              format="percentage"
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sell-in réalisé</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(annualStats.currentSellIn)}
            </div>
            <PeriodComparison 
              currentValue={annualStats.currentSellIn} 
              previousValue={annualStats.lastYearSellIn}
              precision={1}
              format="percentage"
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sell-in prévisionnel</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {formatCurrency(annualStats.projectedSellIn)}
            </div>
            <PeriodComparison 
              currentValue={annualStats.projectedSellIn} 
              previousValue={annualStats.lastYearTotalSellIn}
              precision={1}
              format="percentage"
            />
          </div>
        </div>

        {/* Graphique de prévision */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
              />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
              />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), '']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }}
              />
              <Legend />
              
              {/* Données historiques */}
              <Line 
                type="monotone" 
                dataKey="sellOut" 
                name="Sell-out réalisé" 
                stroke="#4F46E5" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="sellIn" 
                name="Sell-in réalisé" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              
              {/* Prévisions */}
              <Line 
                type="monotone" 
                dataKey="projectedSellOut" 
                name="Sell-out prévisionnel" 
                stroke="#4F46E5" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="projectedSellIn" 
                name="Sell-in prévisionnel" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              
              {/* Ligne de référence pour le mois actuel */}
              <ReferenceLine 
                x={new Date().getMonth()} 
                stroke="#F59E0B" 
                strokeWidth={2}
                label={{
                  value: 'Aujourd\'hui',
                  position: 'insideTopRight',
                  fill: '#F59E0B',
                  fontSize: 12
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Analyse et Recommandations
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {annualStats.projectedSellOut > annualStats.lastYearTotalSellOut ? (
              `Les prévisions pour le segment ${segment.name} indiquent une progression de ${((annualStats.projectedSellOut / annualStats.lastYearTotalSellOut) * 100 - 100).toFixed(1)}% du sell-out par rapport à l'année précédente. `
            ) : (
              `Les prévisions montrent une baisse de ${Math.abs((annualStats.projectedSellOut / annualStats.lastYearTotalSellOut) * 100 - 100).toFixed(1)}% du sell-out pour le segment ${segment.name} par rapport à l'année précédente. `
            )}
            
            {annualStats.projectedSellIn > annualStats.lastYearTotalSellIn ? (
              `Le sell-in devrait augmenter de ${((annualStats.projectedSellIn / annualStats.lastYearTotalSellIn) * 100 - 100).toFixed(1)}%. `
            ) : (
              `Le sell-in est prévu en recul de ${Math.abs((annualStats.projectedSellIn / annualStats.lastYearTotalSellIn) * 100 - 100).toFixed(1)}%. `
            )}
            
            <span className="font-medium">
              {annualStats.projectedSellOut > annualStats.projectedSellIn ? 
                "Les stocks devraient diminuer sur cette période, anticipez les risques de rupture en ajustant votre approvisionnement." : 
                "L'augmentation des stocks prévue pourrait entraîner une immobilisation excessive de capital. Envisagez des promotions ciblées pour optimiser votre rotation de stock."}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}