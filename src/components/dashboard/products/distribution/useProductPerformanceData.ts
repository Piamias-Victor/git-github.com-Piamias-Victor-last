// src/components/dashboard/products/distribution/useProductPerformanceData.ts
import { useState, useEffect } from 'react';
import { Product } from '../ProductResultTable';

interface ProductPerformanceData {
  categoryRank: number; // Rang du produit dans sa catégorie
  categoryTotal: number; // Nombre total de produits dans la catégorie
  labRank: number; // Rang du produit dans son laboratoire
  labTotal: number; // Nombre total de produits du laboratoire
  categoryGrowthDiff: number; // Différence de croissance vs la catégorie (en %)
  marginDiff: number; // Différence de marge vs la moyenne (en %)
}

export function useProductPerformanceData(product: Product) {
  const [data, setData] = useState<ProductPerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Dans une application réelle, on ferait un appel API ici
        // Exemple: const response = await axios.get(`/api/products/performance/${product.id}`);
        
        // Données simulées pour la démonstration
        
        // Calculer un rang basé sur le nombre de ventes (juste pour la démonstration)
        const getRandomRank = (max: number, sales: number): number => {
          // Plus les ventes sont élevées, plus le rang est bon
          const salesFactor = Math.min(0.7, sales / 200); // Factor between 0 and 0.7
          return Math.max(1, Math.ceil((1 - salesFactor) * max * Math.random()));
        };
        
        // Simuler des données de performance
        const mockData: ProductPerformanceData = {
          categoryRank: getRandomRank(25, product.sales),
          categoryTotal: 25, // Total des produits dans la catégorie
          labRank: getRandomRank(40, product.sales),
          labTotal: 40, // Total des produits du laboratoire
          categoryGrowthDiff: Math.round((Math.random() * 20 - 10) * 10) / 10, // Entre -10% et +10%
          marginDiff: Math.round((Math.random() * 16 - 8) * 10) / 10, // Entre -8% et +8%
        };
        
        setData(mockData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de performance:', err);
        setError('Impossible de charger les données de performance pour ce produit.');
      } finally {
        setIsLoading(false);
      }
    };

    if (product && product.id) {
      fetchPerformanceData();
    }
  }, [product]);

  return { data, isLoading, error };
}