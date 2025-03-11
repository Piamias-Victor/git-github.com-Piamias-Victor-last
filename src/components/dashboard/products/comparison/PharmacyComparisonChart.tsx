// src/components/dashboard/products/comparison/PharmacyComparisonChart.tsx
import React, { useState } from 'react';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { PharmacyMetricsCards } from './PharmacyMetricsCards';
import { RadarChartView } from './RadarChartView';
import { usePharmacyData } from './usePharmacyData';
import { PharmacyRadarData } from './types';

interface PharmacyComparisonChartProps {
  productId: string;
  productCode: string;
}

export function PharmacyComparisonChart({ productId, productCode }: PharmacyComparisonChartProps) {
  const { comparisonData, metricDetails, isLoading, error } = usePharmacyData(productId, productCode);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  
  // Trouver les données de la pharmacie sélectionnée
  const selectedPharmacyData = selectedPharmacy 
    ? comparisonData.find(p => p.name === selectedPharmacy) 
    : comparisonData[0];

  if (isLoading) return <LoadingState height="60" message="Chargement des données de comparaison..." />;
  if (error) return <ErrorState message={error} />;

  // Vérifier que les données de métriques sont disponibles
  if (!metricDetails || Object.keys(metricDetails).length === 0) {
    return <LoadingState height="60" message="Chargement des données de métriques détaillées..." />;
  }

  // Gérer la sélection d'une pharmacie depuis la légende
  const handlePharmacySelect = (pharmacyName: string) => {
    setSelectedPharmacy(pharmacyName);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Comparaison avec la moyenne du groupement
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Note:</span> Valeurs en pourcentage (100% = moyenne du groupement)
        </div>
      </div>
      
      {/* Afficher les métriques de la pharmacie sélectionnée */}
      <PharmacyMetricsCards pharmacy={selectedPharmacyData} metricDetails={metricDetails} />
      
      {/* Afficher le graphique radar */}
      <RadarChartView 
        data={comparisonData} 
        onPharmacySelect={handlePharmacySelect}
        selectedPharmacy={selectedPharmacy}
      />
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        <span>Cliquez sur les éléments de la légende pour comparer les données</span>
      </div>
    </div>
  );
}