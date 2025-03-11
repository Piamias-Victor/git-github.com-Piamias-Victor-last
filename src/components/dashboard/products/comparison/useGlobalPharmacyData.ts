// src/components/dashboard/products/comparison/useGlobalPharmacyData.ts
import { useState, useEffect } from 'react';
import { PharmacyRadarData } from './types';

// Interface pour les données détaillées des métriques
export interface MetricDetailData {
  yourValue: number;   // Valeur pour votre pharmacie
  percentage: number;  // Pourcentage par rapport à la moyenne (100% = moyenne)
  groupAvg: number;    // Valeur moyenne du groupement
  groupMax: number;    // Valeur maximale dans le groupement
  groupMin: number;    // Valeur minimale dans le groupement
}
import { Product } from '../ProductResultTable';

export function useGlobalPharmacyData(products: Product[]) {
  const [comparisonData, setComparisonData] = useState<PharmacyRadarData[]>([]);
  const [metricDetails, setMetricDetails] = useState<Record<string, MetricDetailData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalComparisonData = async () => {
      if (!products || products.length === 0) {
        setError("Aucun produit sélectionné pour l'analyse comparative");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dans une implémentation réelle, nous ferions un appel API avec la liste des IDs de produits
        // et recevrions les données agrégées pour le groupement
        
        // Calculs simulés basés sur les produits sélectionnés
        const avgPrice = products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length;
        const avgMargin = products.reduce((sum, p) => sum + parseFloat(p.margin), 0) / products.length;
        const avgMarginRate = products.reduce((sum, p) => sum + parseFloat(p.marginRate.replace('%', '')), 0) / products.length;
        const avgStock = products.reduce((sum, p) => sum + p.stock, 0) / products.length;
        const avgSales = products.reduce((sum, p) => sum + p.sales, 0) / products.length;
        
        // Calculer des indicateurs de performance relative
        // Des pourcentages légèrement différents pour simuler des variations
        const pricePerformance = 97; // 97% du prix moyen (moins cher = mieux)
        const marginPerformance = 108; // 108% de la marge moyenne (plus de marge = mieux)
        const rotationPerformance = 112; // 112% de la rotation moyenne (meilleure rotation = mieux)
        const stockPerformance = 93; // 93% du stock moyen (stock optimisé = mieux)
        const salesPerformance = 115; // 115% des ventes moyennes (plus de ventes = mieux)
        
        // Données simplifiées - uniquement votre pharmacie et la moyenne du groupement
        const mockData: PharmacyRadarData[] = [
          {
            name: "Votre pharmacie",
            price: pricePerformance,
            margin: marginPerformance,
            rotation: rotationPerformance,
            stock: stockPerformance,
            sales: salesPerformance
          },
          {
            name: "Moyenne du groupement",
            price: 100,
            margin: 100,
            rotation: 100,
            stock: 100,
            sales: 100
          }
        ];
        
        // Données détaillées pour les métriques (valeurs réelles, pas des pourcentages)
        const mockMetricDetails: Record<string, MetricDetailData> = {
          price: {
            yourValue: avgPrice * (pricePerformance / 100),
            percentage: pricePerformance,
            groupAvg: avgPrice,
            groupMax: avgPrice * 1.25,
            groupMin: avgPrice * 0.8
          },
          margin: {
            yourValue: avgMargin * (marginPerformance / 100),
            percentage: marginPerformance,
            groupAvg: avgMargin,
            groupMax: avgMargin * 1.3,
            groupMin: avgMargin * 0.7
          },
          rotation: {
            yourValue: 3.5, // Valeur de rotation simulée
            percentage: rotationPerformance,
            groupAvg: 3.12,
            groupMax: 4.8,
            groupMin: 1.9
          },
          stock: {
            yourValue: avgStock * (stockPerformance / 100),
            percentage: stockPerformance,
            groupAvg: avgStock,
            groupMax: avgStock * 1.6,
            groupMin: avgStock * 0.5
          },
          sales: {
            yourValue: avgSales * (salesPerformance / 100),
            percentage: salesPerformance,
            groupAvg: avgSales,
            groupMax: avgSales * 1.7,
            groupMin: avgSales * 0.6
          }
        };
        
        setComparisonData(mockData);
        setMetricDetails(mockMetricDetails);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de comparaison globale:', err);
        setError('Impossible de charger les données de comparaison entre pharmacies.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalComparisonData();
  }, [products]);

  return { comparisonData, metricDetails, isLoading, error };
}