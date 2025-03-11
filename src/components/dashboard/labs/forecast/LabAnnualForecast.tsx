// src/components/dashboard/labs/forecast/LabAnnualForecast.tsx
import React, { useMemo } from 'react';
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
import { Laboratory } from '../LabResultTable';
import { Card } from '@/components/ui/Card';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { PeriodComparison } from '../../metrics/PeriodComparison';
import { useLabForecastData } from './useLabForecastData';

interface LabAnnualForecastProps {
  laboratories: Laboratory[];
  isLoading?: boolean;
  error?: string | null;
}

export function LabAnnualForecast({
  laboratories,
  isLoading = false,
  error = null
}: LabAnnualForecastProps) {
  // Récupérer les données de prévision via notre hook personnalisé
  const { forecastData, annualStats } = useLabForecastData(laboratories);
  
  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  // Gérer les états de chargement et d'erreur
  if (isLoading) return <LoadingState height="60" message="Calcul des prévisions annuelles..." />;
  if (error) return <ErrorState message={error} />;

  // Déterminer les statistiques à afficher
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const progressPercentage = Math.round(((currentMonth + 1) / 12) * 100);

  // Formatteur personnalisé pour les tooltips
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const monthName = monthNames[parseInt(label) - 1];
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-1">{monthName}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className={`text-sm ${entry.color}`}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Prévisions Annuelles {new Date().getFullYear()}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{progressPercentage}%</span> de l'année écoulée
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
                dataKey="month" 
                stroke="#6B7280"
                tickFormatter={(value) => value.toString()}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip content={renderTooltip} />
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
                x={currentMonth + 1} 
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
              `Les prévisions indiquent une progression de ${((annualStats.projectedSellOut / annualStats.lastYearTotalSellOut) * 100 - 100).toFixed(1)}% du sell-out par rapport à l'année précédente. `
            ) : (
              `Les prévisions montrent une baisse de ${Math.abs((annualStats.projectedSellOut / annualStats.lastYearTotalSellOut) * 100 - 100).toFixed(1)}% du sell-out par rapport à l'année précédente. `
            )}
            
            {annualStats.projectedSellIn > annualStats.lastYearTotalSellIn ? (
              `Le sell-in devrait augmenter de ${((annualStats.projectedSellIn / annualStats.lastYearTotalSellIn) * 100 - 100).toFixed(1)}%. `
            ) : (
              `Le sell-in est prévu en recul de ${Math.abs((annualStats.projectedSellIn / annualStats.lastYearTotalSellIn) * 100 - 100).toFixed(1)}%. `
            )}
            
            <span className="font-medium">
              {annualStats.projectedSellOut > annualStats.projectedSellIn ? 
                "Les stocks des pharmacies diminuent sur cette période, pouvant entraîner des risques de rupture." : 
                "Les stocks des pharmacies augmentent, indiquant une possible accumulation."}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}