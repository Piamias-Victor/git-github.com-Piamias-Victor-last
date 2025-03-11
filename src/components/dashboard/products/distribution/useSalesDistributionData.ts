// src/components/dashboard/products/distribution/useSalesDistributionData.ts
import { useState, useEffect } from 'react';
import { Product } from '../ProductResultTable';

interface DistributionDataItem {
  name: string;
  value: number;
  percentage: number;
  isCurrentProduct: boolean;
  unit?: string;
}

export function useSalesDistributionData(product: Product, type: 'category' | 'laboratory') {
  const [data, setData] = useState<DistributionDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistributionData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dans une application réelle, on ferait un appel API ici
        // Exemple: const response = await axios.get(`/api/products/distribution/${product.id}?type=${type}`);
        
        // Données simulées pour la démonstration
        let mockData: DistributionDataItem[] = [];
        
        if (type === 'category') {
          // Données de répartition par catégorie
          const categoryTotal = 580; // Total des ventes dans la catégorie
          const currentProductSales = product.sales;
          const currentProductPercentage = Math.round((currentProductSales / categoryTotal) * 100);
          
          mockData = [
            { 
              name: product.name, 
              value: currentProductSales, 
              percentage: currentProductPercentage,
              isCurrentProduct: true
            },
            { 
              name: "Autre produit similaire", 
              value: Math.floor(categoryTotal * 0.25), 
              percentage: 25,
              isCurrentProduct: false
            },
            { 
              name: "Produit concurrent 1", 
              value: Math.floor(categoryTotal * 0.18), 
              percentage: 18,
              isCurrentProduct: false
            },
            { 
              name: "Produit concurrent 2", 
              value: Math.floor(categoryTotal * 0.12), 
              percentage: 12,
              isCurrentProduct: false
            },
            { 
              name: "Autres produits", 
              value: categoryTotal - currentProductSales - Math.floor(categoryTotal * 0.55), 
              percentage: 100 - currentProductPercentage - 55,
              isCurrentProduct: false
            }
          ];
        } else {
          // Données de répartition par laboratoire
          const labTotal = 950; // Total des ventes du laboratoire
          const currentProductSales = product.sales;
          const currentProductPercentage = Math.round((currentProductSales / labTotal) * 100);
          
          mockData = [
            { 
              name: product.name, 
              value: currentProductSales, 
              percentage: currentProductPercentage,
              isCurrentProduct: true
            },
            { 
              name: "Produit phare du labo", 
              value: Math.floor(labTotal * 0.32), 
              percentage: 32,
              isCurrentProduct: false
            },
            { 
              name: "Autre gamme", 
              value: Math.floor(labTotal * 0.22), 
              percentage: 22,
              isCurrentProduct: false
            },
            { 
              name: "Produits saisonniers", 
              value: Math.floor(labTotal * 0.15), 
              percentage: 15,
              isCurrentProduct: false
            },
            { 
              name: "Autres produits", 
              value: labTotal - currentProductSales - Math.floor(labTotal * 0.69), 
              percentage: 100 - currentProductPercentage - 69,
              isCurrentProduct: false
            }
          ];
        }
        
        setData(mockData);
      } catch (err) {
        console.error(`Erreur lors de la récupération des données de distribution ${type}:`, err);
        setError(`Impossible de charger les données de distribution pour ce produit.`);
      } finally {
        setIsLoading(false);
      }
    };

    if (product && product.id) {
      fetchDistributionData();
    }
  }, [product, type]);

  return { data, isLoading, error };
}