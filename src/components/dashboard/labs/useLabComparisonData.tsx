import React, { useState } from 'react';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { Card } from '@/components/ui/Card';
import { RadarChartView } from '../products/comparison/RadarChartView';
import { PharmacyMetricsCards } from '../products/comparison/PharmacyMetricsCards';
import { PharmacyRadarData, MetricDetailData } from '../products/comparison/types';
import { Laboratory } from './LabResultTable';
import { Product } from '../products/ProductResultTable';

// Hook personnalisé pour obtenir les données de comparaison de laboratoires
function useLabComparisonData(
  laboratories: Laboratory[], 
  allProducts: Product[]
): { 
  comparisonData: PharmacyRadarData[]; 
  metricDetails: Record<string, MetricDetailData>; 
  isLoading: boolean; 
  error: string | null 
} {
  // Filtrer les produits des laboratoires sélectionnés
  const labProducts = allProducts.filter(product => 
    laboratories.some(lab => lab.name === product.laboratory)
  );

  // Calculer les métriques agrégées pour les laboratoires
  const avgPrice = labProducts.reduce((sum, p) => sum + parseFloat(p.price), 0) / labProducts.length;
  const avgMargin = labProducts.reduce((sum, p) => sum + parseFloat(p.margin), 0) / labProducts.length;
  const avgRotation = labProducts.reduce((sum, p) => {
    const rotation = p.stock > 0 ? p.sales / p.stock : 0;
    return sum + rotation;
  }, 0) / labProducts.length;
  const avgStock = labProducts.reduce((sum, p) => sum + p.stock, 0) / labProducts.length;
  const avgSales = labProducts.reduce((sum, p) => sum + p.sales, 0) / labProducts.length;

  // Données simulées pour les laboratoires
  const comparisonData: PharmacyRadarData[] = [
    {
      name: 'Votre laboratoire',
      price: 95, // % par rapport à la moyenne
      margin: 110, // % par rapport à la moyenne
      rotation: 105, // % par rapport à la moyenne
      stock: 95, // % par rapport à la moyenne
      sales: 112 // % par rapport à la moyenne
    },
    {
      name: 'Moyenne du groupement',
      price: 100, // Référence 100%
      margin: 100,
      rotation: 100,
      stock: 100,
      sales: 100
    }
  ];

  // Données détaillées pour les métriques
  const metricDetails: Record<string, MetricDetailData> = {
    price: {
      yourValue: avgPrice,
      percentage: 95,
      groupAvg: avgPrice,
      groupMax: avgPrice * 1.25,
      groupMin: avgPrice * 0.8
    },
    margin: {
      yourValue: avgMargin,
      percentage: 110,
      groupAvg: avgMargin,
      groupMax: avgMargin * 1.3,
      groupMin: avgMargin * 0.7
    },
    rotation: {
      yourValue: avgRotation,
      percentage: 105,
      groupAvg: avgRotation,
      groupMax: avgRotation * 1.5,
      groupMin: avgRotation * 0.7
    },
    stock: {
      yourValue: avgStock,
      percentage: 95,
      groupAvg: avgStock,
      groupMax: avgStock * 1.6,
      groupMin: avgStock * 0.5
    },
    sales: {
      yourValue: avgSales,
      percentage: 112,
      groupAvg: avgSales,
      groupMax: avgSales * 1.7,
      groupMin: avgSales * 0.6
    }
  };

  // Données simulées avec délai de chargement
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { comparisonData, metricDetails, isLoading, error: null };
}

interface LabComparisonChartProps {
  laboratories: Laboratory[];
  allProducts: Product[];
}

export function LabComparisonChart({ 
  laboratories, 
  allProducts 
}: LabComparisonChartProps) {
  const { comparisonData, metricDetails, isLoading, error } = useLabComparisonData(
    laboratories, 
    allProducts
  );
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  
  // Trouver les données du laboratoire sélectionné
  const selectedLabData = selectedPharmacy 
    ? comparisonData.find(p => p.name === selectedPharmacy) 
    : comparisonData[0];

  if (isLoading) return <LoadingState height="60" message="Analyse comparative en cours..." />;
  if (error) return <ErrorState message={error} />;

  // Vérifier que les données de métriques sont disponibles
  if (!metricDetails || Object.keys(metricDetails).length === 0) {
    return <LoadingState height="60" message="Chargement des données de métriques..." />;
  }

  // Gérer la sélection d'un laboratoire depuis la légende
  const handleLabSelect = (labName: string) => {
    setSelectedPharmacy(labName);
  };

  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comparaison avec le groupement
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Analyse globale</span> • {laboratories.length} laboratoires
          </div>
        </div>

        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Cette analyse compare la performance de vos laboratoires par rapport à la moyenne du groupement.
            Les valeurs sont exprimées en pourcentage (100% = moyenne du groupement).
          </p>
        </div>
        
        {/* Afficher les métriques du laboratoire sélectionné */}
        <PharmacyMetricsCards pharmacy={selectedLabData} metricDetails={metricDetails} />
        
        {/* Afficher le graphique radar */}
        <div className="mt-6">
          <RadarChartView 
            data={comparisonData} 
            onPharmacySelect={handleLabSelect}
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