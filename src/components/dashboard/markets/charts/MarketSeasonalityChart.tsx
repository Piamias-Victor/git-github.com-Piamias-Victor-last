// src/components/dashboard/markets/charts/MarketSeasonalityChart.tsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { LoadingState } from '@/components/ui/LoadingState';

interface MarketSeasonalityChartProps {
  segments: MarketSegment[];
  isLoading?: boolean;
}

export function MarketSeasonalityChart({ segments, isLoading = false }: MarketSeasonalityChartProps) {
  // État pour choisir le type de graphique (ligne ou radar)
  const [chartType, setChartType] = React.useState<'line' | 'radar'>('line');
  
  // Génération des données de saisonnalité
  const seasonalityData = useMemo(() => {
    if (segments.length === 0) return [];
    
    // Mois de l'année
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    
    // Facteurs de saisonnalité généraux
    const generalSeasonality = [
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
    
    // Facteurs de saisonnalité spécifiques par type de segment
    const seasonalityFactors: Record<string, number[]> = {
      'Médicaments': [
        1.30, // Jan - Grippes et rhumes
        1.25, // Fév
        1.10, // Mar
        0.95, // Avr
        0.85, // Mai
        0.80, // Juin
        0.70, // Juil
        0.65, // Août - Été, moins de maladies
        0.90, // Sep - Rentrée scolaire
        1.10, // Oct
        1.15, // Nov
        1.25  // Déc - Fêtes, rhumes
      ],
      'Parapharmacie': [
        0.80, // Jan
        0.85, // Fév
        0.95, // Mar
        1.05, // Avr
        1.15, // Mai - Préparation été
        1.40, // Juin - Solaires, pré-vacances
        1.45, // Juil - Pleine saison
        1.30, // Août - Vacances
        1.00, // Sep
        0.85, // Oct
        0.95, // Nov
        1.25  // Déc - Cadeaux
      ],
      'Hygiène & Soins': [
        0.90, // Jan
        0.95, // Fév
        1.00, // Mar
        1.05, // Avr
        1.10, // Mai
        1.15, // Juin
        1.10, // Juil
        1.05, // Août
        1.00, // Sep
        0.95, // Oct
        1.00, // Nov
        1.20  // Déc
      ],
      'Nutrition': [
        1.15, // Jan - Résolutions
        1.05, // Fév
        1.00, // Mar
        0.95, // Avr
        1.05, // Mai
        1.10, // Juin
        0.90, // Juil
        0.85, // Août
        1.10, // Sep - Rentrée
        1.05, // Oct
        0.95, // Nov
        0.85  // Déc
      ]
    };
    
    // Si nous n'avons qu'un seul segment
    if (segments.length === 1) {
      return months.map((month, index) => {
        // Déterminer le facteur de saisonnalité approprié
        let seasonalFactor = generalSeasonality[index];
        
        // Si le segment est un univers connu, utiliser des facteurs spécifiques
        if (segments[0].type === 'universe' && seasonalityFactors[segments[0].name]) {
          seasonalFactor = seasonalityFactors[segments[0].name][index];
        }
        // Pour d'autres types de segments, essayons de déterminer l'univers parent
        else if (segments[0].parent && seasonalityFactors[segments[0].parent]) {
          seasonalFactor = seasonalityFactors[segments[0].parent][index];
          // Ajouter une légère variation
          seasonalFactor *= (0.9 + Math.random() * 0.2);
        }
        
        // Valeur mensuelle moyenne
        const monthlyAvg = segments[0].revenue / 12;
        
        return {
          name: month,
          month: index,
          [segments[0].name]: monthlyAvg * seasonalFactor,
          average: monthlyAvg,
          seasonality: seasonalFactor * 100 // En pourcentage
        };
      });
    }
    
    // Si nous avons plusieurs segments (maximum 3 pour la lisibilité)
    const topSegments = segments
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
    
    return months.map((month, index) => {
      const monthData: any = {
        name: month,
        month: index,
        average: 100, // Base 100 pour la moyenne
      };
      
      // Pour chaque segment
      topSegments.forEach(segment => {
        // Déterminer le facteur de saisonnalité
        let seasonalFactor = generalSeasonality[index];
        
        // Ajuster selon le type de segment si possible
        if (segment.type === 'universe' && seasonalityFactors[segment.name]) {
          seasonalFactor = seasonalityFactors[segment.name][index];
        } else if (segment.parent && seasonalityFactors[segment.parent]) {
          seasonalFactor = seasonalityFactors[segment.parent][index];
          // Légère variation
          seasonalFactor *= (0.9 + Math.random() * 0.2);
        }
        
        // Valeur mensuelle moyenne
        const monthlyAvg = segment.revenue / 12;
        
        // Ajouter au mois
        monthData[segment.name] = monthlyAvg * seasonalFactor;
        // Stocker aussi le facteur de saisonnalité en pourcentage
        monthData[`${segment.name}_seasonality`] = seasonalFactor * 100;
      });
      
      // Calculer la saisonnalité moyenne pondérée
      const totalRevenue = topSegments.reduce((sum, segment) => sum + segment.revenue, 0);
      const weightedSeasonality = topSegments.reduce((sum, segment) => {
        // Déterminer le facteur
        let factor = generalSeasonality[index];
        if (segment.type === 'universe' && seasonalityFactors[segment.name]) {
          factor = seasonalityFactors[segment.name][index];
        } else if (segment.parent && seasonalityFactors[segment.parent]) {
          factor = seasonalityFactors[segment.parent][index];
        }
        
        return sum + (factor * segment.revenue);
      }, 0) / totalRevenue;
      
      monthData.seasonality = weightedSeasonality * 100;
      
      return monthData;
    });
  }, [segments]);

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

  // Sélection des segments à afficher
  const displaySegments = segments.length === 1 
    ? [segments[0]] 
    : segments.slice(0, 3);

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse de la saisonnalité..." />;
  }

  // Si aucun segment
  if (segments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun segment sélectionné pour l'analyse de saisonnalité
      </div>
    );
  }

  // Identifier les mois de haute et basse saison
  const highSeasonMonths = seasonalityData
    .filter(data => data.seasonality > 110)
    .map(data => data.name)
    .join(', ');
    
  const lowSeasonMonths = seasonalityData
    .filter(data => data.seasonality < 90)
    .map(data => data.name)
    .join(', ');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          Analyse de la saisonnalité
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded-l-md ${
              chartType === 'line'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Ligne
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`px-3 py-1 text-sm rounded-r-md ${
              chartType === 'radar'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Radar
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={seasonalityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
              />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                domain={[60, 160]}
              />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  // Si c'est une valeur de saisonnalité
                  if (name === 'seasonality' || name.endsWith('_seasonality')) {
                    const displayName = name === 'seasonality' 
                      ? 'Indice saisonnier' 
                      : name.replace('_seasonality', '');
                    return [`${value.toFixed(1)}%`, displayName];
                  }
                  
                  // Pour les autres valeurs (non affichées dans ce mode)
                  return [formatCurrency(value), name];
                }}
                labelFormatter={(label) => `Mois: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }}
              />
              <Legend />
              
              {/* Ligne de référence pour 100% */}
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
              
              {/* Afficher les courbes de saisonnalité pour chaque segment */}
              {displaySegments.length === 1 ? (
                <Line 
                  type="monotone" 
                  dataKey="seasonality" 
                  name="Indice saisonnier" 
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              ) : (
                displaySegments.map((segment, index) => (
                  <Line 
                    key={segment.id}
                    type="monotone" 
                    dataKey={`${segment.name}_seasonality`} 
                    name={segment.name} 
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                ))
              )}
            </LineChart>
          ) : (
            <RadarChart 
              data={seasonalityData}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 160]} 
                tickFormatter={(value) => `${value}%`}
              />
              
              {displaySegments.length === 1 ? (
                <Radar 
                  name="Indice saisonnier" 
                  dataKey="seasonality" 
                  stroke="#4F46E5" 
                  fill="#4F46E5" 
                  fillOpacity={0.6} 
                />
              ) : (
                displaySegments.map((segment, index) => (
                  <Radar 
                    key={segment.id}
                    name={segment.name} 
                    dataKey={`${segment.name}_seasonality`} 
                    stroke={colors[index % colors.length]} 
                    fill={colors[index % colors.length]} 
                    fillOpacity={0.5} 
                  />
                ))
              )}
              <Legend />
              <Tooltip 
                formatter={(value: any) => [`${value.toFixed(1)}%`, 'Indice saisonnier']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }}
              />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Haute saison
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {highSeasonMonths.length > 0 
              ? `Les mois de haute saison sont : ${highSeasonMonths}. L'activité pendant ces périodes est supérieure à la moyenne annuelle de plus de 10%.`
              : "Aucun mois ne présente une saisonnalité particulièrement élevée."
            }
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Basse saison
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lowSeasonMonths.length > 0 
              ? `Les mois de basse saison sont : ${lowSeasonMonths}. L'activité pendant ces périodes est inférieure à la moyenne annuelle de plus de 10%.`
              : "Aucun mois ne présente une saisonnalité particulièrement basse."
            }
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Actions recommandées
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {highSeasonMonths.length > 0 
            ? `Planifiez vos campagnes marketing et vos stocks en prévision des périodes de forte demande (${highSeasonMonths}). Envisagez des promotions pendant les périodes creuses (${lowSeasonMonths || "aucune période particulière"}) pour stimuler les ventes.`
            : "La demande pour ces segments reste relativement stable tout au long de l'année. Vous pouvez planifier vos actions marketing et vos stocks de manière uniforme."
          }
        </p>
      </div>
    </div>
)}