// src/components/dashboard/markets/TopLaboratoriesChart.tsx
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector, Treemap } from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { LoadingState } from '@/components/ui/LoadingState';

interface TopLaboratoriesChartProps {
  segments: MarketSegment[];
  isLoading?: boolean;
}

export function TopLaboratoriesChart({ segments, isLoading = false }: TopLaboratoriesChartProps) {
  // État pour la visualisation active (camembert ou treemap)
  const [activeView, setActiveView] = useState<'pie' | 'treemap'>('pie');
  
  // État pour le secteur actif dans le graphique camembert
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Générer les données pour les laboratoires
  const { labData, totalMarket } = useMemo(() => {
    // Si pas de segments, retourner des données vides
    if (!segments.length) return { labData: [], totalMarket: 0 };
    
    // Si nous avons un seul segment où un laboratoire dominant est spécifié
    if (segments.length === 1 && segments[0].dominantLab && segments[0].dominantLab !== 'N/A') {
      // Simuler une répartition des parts de marché basée sur le laboratoire dominant
      const dominantLab = segments[0].dominantLab;
      const dominantShare = Math.floor(30 + Math.random() * 20); // Entre 30% et 50%
      
      // Autres laboratoires hypothétiques
      const otherLabs = [
        { name: getOtherLabName(1, dominantLab), share: Math.floor(10 + Math.random() * 15) },
        { name: getOtherLabName(2, dominantLab), share: Math.floor(5 + Math.random() * 15) },
        { name: getOtherLabName(3, dominantLab), share: Math.floor(5 + Math.random() * 10) },
        { name: getOtherLabName(4, dominantLab), share: Math.floor(3 + Math.random() * 7) }
      ];
      
      // Calculer ce qui reste pour "Autres"
      const othersShare = 100 - dominantShare - otherLabs.reduce((sum, lab) => sum + lab.share, 0);
      
      // Créer les données
      const data = [
        { 
          name: dominantLab, 
          value: dominantShare, 
          revenue: (segments[0].revenue * dominantShare) / 100,
          growth: generateGrowthValue(dominantShare > 40 ? 'high' : 'medium')
        },
        ...otherLabs.map(lab => ({
          name: lab.name,
          value: lab.share,
          revenue: (segments[0].revenue * lab.share) / 100,
          growth: generateGrowthValue()
        })),
        { 
          name: 'Autres laboratoires', 
          value: othersShare,
          revenue: (segments[0].revenue * othersShare) / 100,
          growth: '+1.2%'
        }
      ];
      
      return { 
        labData: data.sort((a, b) => b.value - a.value),
        totalMarket: segments[0].revenue
      };
    }
    
    // Si nous avons plusieurs segments, assembler des données plus complètes
    // D'abord, collecter tous les laboratoires dominants mentionnés
    const labsMap = new Map();
    let totalRevenue = 0;
    
    segments.forEach(segment => {
      totalRevenue += segment.revenue;
      
      if (segment.dominantLab && segment.dominantLab !== 'N/A') {
        // Le lab dominant représente environ 30-50% de son segment
        const dominantShare = 0.3 + Math.random() * 0.2;
        const labRevenue = segment.revenue * dominantShare;
        
        if (labsMap.has(segment.dominantLab)) {
          labsMap.set(
            segment.dominantLab, 
            labsMap.get(segment.dominantLab) + labRevenue
          );
        } else {
          labsMap.set(segment.dominantLab, labRevenue);
        }
      }
    });
    
    // Ajouter quelques laboratoires supplémentaires si nécessaire
    if (labsMap.size < 3) {
      const additionalLabs = ['Sanofi', 'Pfizer', 'Bayer', 'Novartis', 'GSK', 'Servier', 'Pierre Fabre'];
      for (let i = 0; i < 3 - labsMap.size; i++) {
        const labName = additionalLabs.find(name => !labsMap.has(name)) || `Lab ${i+1}`;
        labsMap.set(labName, totalRevenue * (0.05 + Math.random() * 0.15));
      }
    }
    
    // Calculer le revenu restant pour "Autres"
    const mappedRevenue = Array.from(labsMap.values()).reduce((sum, rev) => sum + rev, 0);
    const othersRevenue = totalRevenue - mappedRevenue;
    
    // Créer le tableau final
    const data = [
      ...Array.from(labsMap.entries()).map(([name, revenue]) => ({
        name,
        value: (revenue / totalRevenue) * 100,
        revenue,
        growth: generateGrowthValue()
      })),
      {
        name: 'Autres laboratoires',
        value: (othersRevenue / totalRevenue) * 100,
        revenue: othersRevenue,
        growth: '+0.8%'
      }
    ];
    
    return { 
      labData: data.sort((a, b) => b.value - a.value),
      totalMarket: totalRevenue
    };
  }, [segments]);

  // COULEURS
  const COLORS = [
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

  // Gérer les interactions avec le camembert
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Définir le composant pour le secteur actif
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 1}
          fill={fill}
        />
      </g>
    );
  };

  // Si en cours de chargement
  if (isLoading) {
    return <LoadingState height="60" message="Analyse des parts de marché par laboratoire..." />;
  }

  // Si aucun segment
  if (segments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center text-gray-500 dark:text-gray-400">
        Aucun segment sélectionné pour analyser les laboratoires
      </div>
    );
  }

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, value, index } = props;
    const fill = COLORS[index % COLORS.length];
    
    if (width < 40 || height < 40) {
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill,
              stroke: '#fff',
              strokeWidth: 2,
              strokeOpacity: 1
            }}
          />
        </g>
      );
    }
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill,
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
        >
          {value.toFixed(1)}%
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          {segments.length === 1 
            ? `Parts de marché par laboratoire - ${segments[0].name}` 
            : 'Parts de marché par laboratoire'}
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('pie')}
            className={`px-3 py-1 text-sm rounded-l-md ${
              activeView === 'pie'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Camembert
          </button>
          <button
            onClick={() => setActiveView('treemap')}
            className={`px-3 py-1 text-sm rounded-r-md ${
              activeView === 'treemap'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Treemap
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeView === 'pie' ? (
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={labData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {labData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, props: any) => {
                    const item = props.payload;
                    return [
                      <div key="value" className="flex flex-col">
                        <span className="font-medium">{value.toFixed(1)}%</span>
                        <span className="text-xs">{formatCurrency(item.revenue)}</span>
                      </div>,
                      name
                    ];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderColor: '#E5E7EB',
                    color: '#111827',
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </PieChart>
            ) : (
              <Treemap
  data={labData}
  dataKey="revenue"
  aspectRatio={4 / 3}
  stroke="#fff"
  content={<CustomContent />}
>
  <Tooltip
    formatter={(value: any, name: string, props: any) => {
      const item = props.payload;
      return [formatCurrency(item.revenue), name];
    }}
    contentStyle={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
      borderColor: '#E5E7EB',
      color: '#111827',
    }}
  />
</Treemap>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Top laboratoires
          </h4>
          
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Laboratoire
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Part (%)
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CA
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Évolution
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {labData.slice(0, 6).map((lab, index) => (
                  <tr key={index} className={index === activeIndex ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        {lab.name}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {lab.value.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(lab.revenue)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <span className={`${lab.growth.startsWith('-') 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-green-500 dark:text-green-400'}`}
                      >
                        {lab.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-auto pt-6">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observations
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {labData.length > 0 && (
                  labData[0].value > 40 
                    ? `Le marché est dominé par ${labData[0].name} qui représente ${labData[0].value.toFixed(1)}% du marché total de ${formatCurrency(totalMarket)}.`
                    : `Le marché est relativement fragmenté avec ${labData[0].name} en tête à ${labData[0].value.toFixed(1)}% du marché total de ${formatCurrency(totalMarket)}.`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonctions utilitaires

// Générer un nom de laboratoire différent du dominant
function getOtherLabName(index: number, dominantLab: string): string {
  const labNames = [
    'Sanofi', 'Pfizer', 'Bayer', 'Novartis', 'GSK', 
    'Servier', 'Pierre Fabre', 'Roche', 'Biogaran', 'Mylan'
  ];
  
  // Filtrer le laboratoire dominant
  const filteredNames = labNames.filter(name => name !== dominantLab);
  
  // Retourner un nom en fonction de l'index
  return filteredNames[index % filteredNames.length];
}

// Générer une valeur de croissance réaliste
function generateGrowthValue(type: 'high' | 'medium' | 'low' = 'medium'): string {
  let base: number;
  
  switch (type) {
    case 'high':
      base = 3 + Math.random() * 7; // 3% à 10%
      break;
    case 'low':
      base = -5 + Math.random() * 7; // -5% à 2%
      break;
    default:
      base = -2 + Math.random() * 8; // -2% à 6%
  }
  
  // Arrondir à une décimale
  const value = Math.round(base * 10) / 10;
  
  return value >= 0 ? `+${value}%` : `${value}%`;
}