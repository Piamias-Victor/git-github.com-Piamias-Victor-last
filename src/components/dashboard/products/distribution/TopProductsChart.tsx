import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';

// Types pour les données
interface TopProductData {
  name: string;
  value: number;
  isCurrentProduct: boolean;
}

interface TopProductsChartProps {
  product: {
    id: string;
    ean: string;
    name: string;
    category: string;
    laboratory: string;
    sales: number;
  };
  type: 'category' | 'laboratory';
}

const TopProductsChart = ({ product, type }: TopProductsChartProps) => {
  const [data, setData] = useState<TopProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTopProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Dans une application réelle, ce serait un appel API
        // Ici, nous générons des données de test
        const mockTopProducts: TopProductData[] = [];
        
        // Valeur de référence basée sur les ventes du produit actuel
        const referenceSales = product.sales;
        
        // Détermine le titre de la sélection (catégorie ou laboratoire)
        const selectionTitle = type === 'category' ? product.category : product.laboratory;
        
        // Ajoute le produit actuel aux données
        const currentProductEntry = {
          name: product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name,
          value: referenceSales,
          isCurrentProduct: true
        };
        
        // Génère 4 autres produits fictifs avec des valeurs de vente variables
        const otherProducts = [];
        for (let i = 1; i <= 4; i++) {
          const randomFactor = 0.5 + Math.random() * 1.5; // Entre 50% et 150% des ventes du produit actuel
          otherProducts.push({
            name: `Produit ${type === 'category' ? 'Catégorie' : 'Labo'} ${i}`,
            value: Math.round(referenceSales * randomFactor),
            isCurrentProduct: false
          });
        }
        
        // Trie tous les produits par valeur de vente (décroissant)
        const allProducts = [currentProductEntry, ...otherProducts]
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Prend les 5 meilleurs
        
        setData(allProducts);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de charger le top 5 des produits.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopProducts();
  }, [product, type]);
  
  if (isLoading) return <LoadingState height="40" message={`Chargement du top 5 des produits...`} />;
  if (error) return <ErrorState message={error} />;
  
  // Formatage du tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.value} ventes
          </p>
          {data.isCurrentProduct && (
            <p className="text-xs mt-1 text-indigo-600 dark:text-indigo-400 font-medium">
              Produit sélectionné
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Top 5 des produits {type === 'category' ? 'de la catégorie' : 'du laboratoire'} {type === 'category' ? product.category : product.laboratory}
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={renderTooltip} />
            <Bar 
              dataKey="value" 
              name="Ventes" 
              fill="#4F46E5"
              radius={[0, 4, 4, 0]}
              // Colore différemment le produit actuel
              background={{ fill: '#f3f4f6' }}
              barSize={24}
            >
              {data.map((entry, index) => (
                <cell 
                  key={`cell-${index}`} 
                  fill={entry.isCurrentProduct ? '#818CF8' : '#4F46E5'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        Le produit {product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name} est {
          data.findIndex(item => item.isCurrentProduct) + 1 <= 3 
            ? <span className="font-medium text-indigo-600 dark:text-indigo-400">parmi les 3 meilleurs produits</span>
            : <span className="font-medium">en position {data.findIndex(item => item.isCurrentProduct) + 1}</span>
        } de {type === 'category' ? 'sa catégorie' : 'son laboratoire'}
      </div>
    </div>
  );
};

export default TopProductsChart;