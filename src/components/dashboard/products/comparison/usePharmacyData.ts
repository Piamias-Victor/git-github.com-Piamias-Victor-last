// src/components/dashboard/products/comparison/usePharmacyData.ts
import { useState, useEffect } from 'react';
import { PharmacyRadarData, MetricDetailData } from './types';

export function usePharmacyData(productId: string, productCode: string) {
  const [comparisonData, setComparisonData] = useState<PharmacyRadarData[]>([]);
  const [metricDetails, setMetricDetails] = useState<Record<string, MetricDetailData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPharmacyData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données simplifiées - uniquement votre pharmacie et la moyenne du groupement
        const mockData: PharmacyRadarData[] = [
          {
            name: "Votre pharmacie",
            price: 95, // % par rapport à la moyenne (100% = prix moyen)
            margin: 110, // % par rapport à la moyenne
            rotation: 105, // % par rapport à la moyenne
            stock: 95, // % par rapport à la moyenne
            sales: 112 // % par rapport à la moyenne
          },
          {
            name: "Moyenne du groupement",
            price: 100, // 100% = valeur de référence
            margin: 100,
            rotation: 100,
            stock: 100,
            sales: 100
          }
        ];
        
        // Données détaillées pour les métriques (valeurs réelles, pas des pourcentages)
        const mockMetricDetails: Record<string, MetricDetailData> = {
          price: {
            yourValue: 4.75,
            percentage: 95,
            groupAvg: 5.00,
            groupMax: 5.80,
            groupMin: 4.25
          },
          margin: {
            yourValue: 1.65,
            percentage: 110,
            groupAvg: 1.50,
            groupMax: 1.85,
            groupMin: 1.05
          },
          rotation: {
            yourValue: 3.15,
            percentage: 105,
            groupAvg: 3.00,
            groupMax: 4.20,
            groupMin: 1.60
          },
          stock: {
            yourValue: 38,
            percentage: 95,
            groupAvg: 40,
            groupMax: 62,
            groupMin: 18
          },
          sales: {
            yourValue: 112,
            percentage: 112,
            groupAvg: 100,
            groupMax: 156,
            groupMin: 42
          }
        };
        
        setComparisonData(mockData);
        setMetricDetails(mockMetricDetails);
        
        // S'assurer que les états sont tous mis à jour avant de terminer le chargement
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de comparaison:', err);
        setError('Impossible de charger les données de comparaison entre pharmacies.');
        setIsLoading(false);
      }
    };

    fetchPharmacyData();
  }, [productId, productCode]);

  return { comparisonData, metricDetails, isLoading, error };
}