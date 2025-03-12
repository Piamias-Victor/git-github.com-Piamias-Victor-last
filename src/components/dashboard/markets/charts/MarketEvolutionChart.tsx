// src/components/dashboard/markets/charts/MarketEvolutionChart.tsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { LoadingState } from '@/components/ui/LoadingState';

interface MarketEvolutionChartProps {
  segments: MarketSegment[];
  startDate: string;
  endDate: string;
  isLoading?: boolean;
}

export function MarketEvolutionChart({ segments, startDate, endDate, isLoading = false }: MarketEvolutionChartProps) {
  // Générer des données d'évolution sur 5 ans
  const evolutionData = useMemo(() => {
    if (segments.length === 0) return [];
    
    // Années à afficher
    const years = [2021, 2022, 2023, 2024, 2025];
    
    // Si nous n'avons qu'un seul segment
    if (segments.length === 1) {
      const segment = segments[0];
      // Extraire le taux de croissance actuel
      const growthRate = parseFloat(segment.growth.replace('%', '').replace('+', '')) / 100;
      
      // Valeur actuelle
      const currentValue = segment.revenue;
      
      // Calculer les valeurs rétrospectivement en fonction du taux de croissance
      return years.map((year, index) => {
        // Pour 2025, prendre la valeur actuelle
        if (year === 2025) {
          return {
            year,
            [segment.name]: currentValue,
            [`${segment.name}_percentage`]: 100, // Base 100 pour l'année actuelle
          };
        }
        
        // Pour les années précédentes, calculer en fonction de la croissance
        // Formule: valeur_précédente = valeur_actuelle / (1 + taux_croissance)^années_depuis
        const yearsSince = 2025 - year;
        const pastValue = currentValue / Math.pow(1 + growthRate, yearsSince);
        
        return {
          year,
          [segment.name]: pastValue,
          [`${segment.name}_percentage`]: (pastValue / currentValue) * 100, // En pourcentage par rapport à 2025
        };
      });
    }
    
    // Si nous avons plusieurs segments (maximum 3 pour la lisibilité)
    const topSegments = segments
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
    
    // Pour chaque année
    return years.map((year, yearIndex) => {
      const yearData: any = { year };
      
      // Pour chaque segment
      topSegments.forEach(segment => {
        // Extraire le taux de croissance
        const growthRate = parseFloat(segment.growth.replace('%', '').replace('+', '')) / 100;
        
        // Valeur actuelle
        const currentValue = segment.revenue;
        
        // Pour 2025, prendre la valeur actuelle
        if (year === 2025) {
          yearData[segment.name] = currentValue;
          yearData[`${segment.name}_percentage`] = 100;
        } else {
          // Pour les années précédentes
          const yearsSince = 2025 - year;
          // Ajouter une légère variation pour chaque segment
          const variationFactor = 0.9 + (parseInt(segment.id) % 3) * 0.1;
          const pastValue = currentValue / (Math.pow(1 + growthRate, yearsSince) * variationFactor);
          
          yearData[segment.name] = pastValue;
          yearData[`${segment.name}_percentage`] = (pastValue / currentValue) * 100;
        }
      });
      
      // Ajouter aussi une courbe pour l'ensemble du marché
      const totalCurrentValue = topSegments.reduce((sum, segment) => sum + segment.revenue, 0);
      // Calculer un taux de croissance moyen pondéré
      const weightedGrowthRate = topSegments.reduce((sum, segment) => {
        const growthRate = parseFloat(segment.growth.replace('%', '').replace('+', '')) / 100;
        return sum + (growthRate * segment.revenue);
      }, 0) / totalCurrentValue;
      
      if (year === 2025) {
        yearData['Total marché'] = totalCurrentValue;
        yearData['Total marché_percentage'] = 100;
      } else {
        const yearsSince = 2025 - year;
        const pastTotalValue = totalCurrentValue / Math.pow(1 + weightedGrowthRate, yearsSince);
        
        yearData['Total marché'] = pastTotalValue;
        yearData['Total marché_percentage'] = (pastTotalValue / totalCurrentValue) * 100;
      }
      
      return yearData;
    });
  }, [segments]);

  // Déterminer le type de graphique à afficher (valeurs ou pourcentages)
  const [showPercentages, setShowPercentages] = React.useState(false);

  // Couleurs pour les lignes
  const colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444'
  ];

  // Formater les valeurs monétaires
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Définir les segments à afficher
  const displaySegments = segments.length === 1 
    ? [segments[0]] 
    : segments.slice(0, 3);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Génération des graphiques d'évolution..." />;
  }

  // Si aucun segment
  if (segments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun segment sélectionné pour afficher l'évolution
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          Évolution du marché (5 ans)
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPercentages(false)}
            className={`px-3 py-1 text-sm rounded-l-md ${
              !showPercentages
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Valeurs
          </button>
          <button
            onClick={() => setShowPercentages(true)}
            className={`px-3 py-1 text-sm rounded-r-md ${
              showPercentages
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Évolution (%)
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={evolutionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="year" 
              stroke="#6B7280"
            />
            <YAxis 
              stroke="#6B7280"
              tickFormatter={(value) => showPercentages 
                ? `${value.toFixed(0)}%` 
                : `${(value / 1000).toFixed(0)}k€`
              }
            />
            <Tooltip 
              formatter={(value: any, name: string) => {
                // Supprimer le suffixe "_percentage" du nom pour l'affichage
                const displayName = name.endsWith('_percentage') 
                  ? name.replace('_percentage', '') 
                  : name;
                  
                return [
                  showPercentages 
                    ? `${value.toFixed(1)}%` 
                    : formatCurrency(value),
                  displayName
                ];
              }}
              labelFormatter={(label) => `Année ${label}`}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderColor: '#E5E7EB',
                color: '#111827',
              }}
            />
            <Legend />
            
            {/* Ligne de référence pour 100% */}
            {showPercentages && (
              <ReferenceLine 
                y={100} 
                stroke="#9CA3AF" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Base 100%', 
                  position: 'right',
                  fill: '#9CA3AF',
                  fontSize: 12
                }} 
              />
            )}
            
            {/* Lignes pour chaque segment */}
            {displaySegments.map((segment, index) => (
              <Line 
                key={segment.id}
                type="monotone" 
                dataKey={showPercentages ? `${segment.name}_percentage` : segment.name}
                name={segment.name}
                stroke={colors[index % colors.length]} 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
            
            {/* Ligne pour le total du marché */}
            {segments.length > 1 && (
              <Line 
                type="monotone" 
                dataKey={showPercentages ? "Total marché_percentage" : "Total marché"} 
                name="Total marché"
                stroke="#8B5CF6"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interprétation
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {segments.length === 1
              ? `Le segment ${segments[0].name} montre une ${segments[0].growth.startsWith('-') ? 'baisse' : 'croissance'} de ${segments[0].growth.replace('+', '')} par rapport à l'année précédente.`
              : `Le graphique illustre l'évolution des segments principaux sur 5 ans. La tendance globale du marché est de ${
                  evolutionData[evolutionData.length - 1]['Total marché_percentage'] - 
                  evolutionData[0]['Total marché_percentage'] > 0 
                    ? 'croissance' 
                    : 'décroissance'
                }.`
            }
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comparaison des tendances
          </h4>
          <div className="space-y-2">
            {displaySegments.map((segment, index) => {
              const startValue = evolutionData[0][`${segment.name}_percentage`];
              const endValue = evolutionData[evolutionData.length - 1][`${segment.name}_percentage`];
              const growth = (endValue - startValue) / startValue * 100;
              
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{segment.name}</span>
                  <span className={`text-sm font-medium ${
                    growth >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% sur 5 ans
                  </span>
                </div>
              );
            })}
            
            {segments.length > 1 && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total marché</span>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {segments.length === 1 
                    ? segments[0].growth 
                    : `+${((evolutionData[evolutionData.length - 1]['Total marché'] / 
                         evolutionData[0]['Total marché'] - 1) * 100).toFixed(1)}% sur 5 ans`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}