// src/components/dashboard/products/comparison/RadarChartView.tsx
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { PharmacyRadarData } from './types';

interface RadarChartViewProps {
  data: PharmacyRadarData[];
  onPharmacySelect: (pharmacyName: string) => void;
  selectedPharmacy: string | null;
}

export function RadarChartView({ 
  data, 
  onPharmacySelect, 
  selectedPharmacy 
}: RadarChartViewProps) {
  
  // Formater les données pour le format attendu par le graphique radar
  const formatDataForRadarChart = () => {
    const metrics = ['Prix', 'Marge', 'Rotation', 'Stock', 'Ventes'];
    const dataKeys = ['price', 'margin', 'rotation', 'stock', 'sales'];
    
    return metrics.map((metric, index) => {
      const dataKey = dataKeys[index];
      return {
        subject: metric,
        fullMark: 120,
        ...data.reduce((acc, pharmacy) => ({ 
          ...acc, 
          [pharmacy.name]: pharmacy[dataKey as keyof PharmacyRadarData]
        }), {})
      };
    });
  };

  // Couleurs spécifiques pour votre pharmacie et la moyenne du groupement
  const getPharmacyColor = (pharmacyName: string) => {
    return pharmacyName === "Votre pharmacie" ? '#4F46E5' : '#10B981';
  };

  // Gérer le clic sur une entrée de légende
  const handleLegendClick = (e: any) => {
    if (e && e.dataKey) {
      onPharmacySelect(e.dataKey);
    }
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={90} data={formatDataForRadarChart()}>
          <PolarGrid stroke="#374151" opacity={0.2} />
          <PolarAngleAxis dataKey="subject" stroke="#6B7280" />
          <PolarRadiusAxis angle={90} domain={[0, 120]} stroke="#6B7280" />
          {data.map((pharmacy) => (
            <Radar
              key={pharmacy.name}
              name={pharmacy.name}
              dataKey={pharmacy.name}
              stroke={getPharmacyColor(pharmacy.name)}
              fill={getPharmacyColor(pharmacy.name)}
              fillOpacity={selectedPharmacy === pharmacy.name ? 0.5 : 0.3}
              strokeWidth={selectedPharmacy === pharmacy.name ? 2 : 1}
              dot={true}
              isAnimationActive={true}
            />
          ))}
          <Legend onClick={handleLegendClick} />
          <Tooltip formatter={(value: any) => [`${value}%`, '']} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}