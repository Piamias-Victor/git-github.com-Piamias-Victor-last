// src/components/dashboard/products/comparison/GlobalComparisonChart.tsx
import React, { useState } from 'react';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { Card } from '@/components/ui/Card';
import { RadarChartView } from './RadarChartView';
import { PharmacyMetricsCards } from './PharmacyMetricsCards';
import { PharmacyRadarData } from './types';
import { Product } from '../ProductResultTable';
import { useGlobalPharmacyData } from './useGlobalPharmacyData';

interface GlobalComparisonChartProps {
  products: Product[];
}

export function GlobalComparisonChart({ products }: GlobalComparisonChartProps) {
  const { comparisonData, metricDetails, isLoading, error } = useGlobalPharmacyData(products);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  
  // Trouver les données de la pharmacie sélectionnée
  const selectedPharmacyData = selectedPharmacy 
    ? comparisonData.find(p => p.name === selectedPharmacy) 
    : comparisonData[0];

  if (isLoading) return <LoadingState height="60" message="Analyse comparative en cours..." />;
  if (error) return <ErrorState message={error} />;

  // Vérifier que les données de métriques sont disponibles
  if (!metricDetails || Object.keys(metricDetails).length === 0) {
    return <LoadingState height="60" message="Chargement des données de métriques..." />;
  }

  // Gérer la sélection d'une pharmacie depuis la légende
  const handlePharmacySelect = (pharmacyName: string) => {
    setSelectedPharmacy(pharmacyName);
  };

  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comparaison avec le groupement
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Analyse globale</span> • {products.length} produits
          </div>
        </div>

        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Cette analyse compare la performance de votre sélection de produits par rapport à la moyenne du groupement.
            Les valeurs sont exprimées en pourcentage (100% = moyenne du groupement).
          </p>
        </div>
        
        {/* Afficher les métriques de la pharmacie sélectionnée */}
        <PharmacyMetricsCards pharmacy={selectedPharmacyData} metricDetails={metricDetails} />
        
        {/* Afficher le graphique radar */}
        <div className="mt-6">
          <RadarChartView 
            data={comparisonData} 
            onPharmacySelect={handlePharmacySelect}
            selectedPharmacy={selectedPharmacy}
          />
          
          <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            <span>Cliquez sur les éléments de la légende pour comparer les données</span>
          </div>
        </div>
      </div>
    </Card>
  );
}