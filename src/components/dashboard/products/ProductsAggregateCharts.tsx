// src/components/dashboard/products/ProductsAggregateCharts.tsx
import React, { useEffect, useState } from 'react';
import { useDateRange } from '@/providers/DateRangeProvider';
import { Product } from './ProductResultTable';
import { SalesChart } from '../charts/SalesChart';
import { StockChart } from '../charts/StockChart';
import { MarginSummary } from './summaries/MarginSummary';
import { SalesTrendSummary } from './summaries/SalesTrendSummary';
import { StockSummary } from './summaries/StockSummary';
import { ProductTopRankings } from './ProductTopRankings';
interface ProductsAggregateChartsProps {
  products: Product[];
}

export function ProductsAggregateCharts({ products }: ProductsAggregateChartsProps) {
  const { startDate, endDate } = useDateRange();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateAggregateData = async () => {
      if (!products.length || !startDate || !endDate) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Générer les données pour les 6 derniers mois
        const salesAggregateData = generateMockSalesData(products);
        const stockAggregateData = generateMockStockData(products);
        
        setSalesData(salesAggregateData);
        setStockData(stockAggregateData);
      } catch (err) {
        console.error('Erreur lors de la génération des données agrégées:', err);
        setError('Impossible de générer les graphiques agrégés.');
      } finally {
        setIsLoading(false);
      }
    };

    generateAggregateData();
  }, [products, startDate, endDate]);

  if (products.length === 0) return null;

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Analyse globale des {products.length} produits sélectionnés
      </h3>
      
      <SalesChart 
        data={salesData} 
        isLoading={isLoading} 
        error={error} 
        startDate={startDate} 
        endDate={endDate} 
      />
      
      <StockChart 
        data={stockData} 
        isLoading={isLoading} 
        error={error} 
        startDate={startDate} 
        endDate={endDate} 
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <ProductTopRankings products={products} />
        <StockSummary products={products} />
        <MarginSummary products={products} />
        <SalesTrendSummary products={products} />
      </div>
    </div>
  );
}

// Fonction qui génère des données de ventes simulées pour l'ensemble des produits
function generateMockSalesData(products: Product[]): any[] {
  // Calculer la période (6 derniers mois)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5); // 6 mois incluant le mois actuel
  
  const monthlyData = [];
  const currentDate = new Date(startDate);
  
  // Facteurs pour ajouter des variations saisonnières et des tendances
  const seasonalEffect = [1.2, 1.1, 1.0, 0.9, 1.0, 1.1]; // Effet saisonnier par mois
  
  // Pour chaque mois dans la période
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(currentDate);
    
    // Base pour les métriques agrégées
    const totalQuantity = products.reduce((sum, product) => {
      return sum + Math.floor(product.sales * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
    }, 0);
    
    const totalRevenue = products.reduce((sum, product) => {
      const monthSales = Math.floor(product.sales * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
      return sum + (parseFloat(product.price) * monthSales);
    }, 0);
    
    const totalMargin = products.reduce((sum, product) => {
      const monthSales = Math.floor(product.sales * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
      return sum + (parseFloat(product.margin) * monthSales);
    }, 0);
    
    monthlyData.push({
      date: monthDate.toISOString().split('T')[0],
      quantity: totalQuantity,
      revenue: Math.round(totalRevenue * 100) / 100,
      margin: Math.round(totalMargin * 100) / 100
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return monthlyData;
}

// Fonction qui génère des données de stock simulées pour l'ensemble des produits
function generateMockStockData(products: Product[]): any[] {
  // Calculer la période (6 derniers mois)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5); // 6 mois incluant le mois actuel
  
  const monthlyData = [];
  const currentDate = new Date(startDate);
  
  // Facteurs pour ajouter des variations saisonnières
  const seasonalEffect = [1.1, 1.0, 0.9, 1.0, 1.1, 1.2]; // Effet inverse pour les stocks
  
  // Périodes de forte demande (pour simuler plus de ruptures de stock)
  const highDemandMonths = [0, 5]; // Janvier et Juin (indices 0 et 5)
  
  // Pour chaque mois dans la période
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(currentDate);
    const monthIndex = currentDate.getMonth();
    
    // Stock total agrégé pour ce mois
    const totalStock = products.reduce((sum, product) => {
      return sum + Math.floor(product.stock * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
    }, 0);
    
    // Valeur totale du stock pour ce mois
    const totalStockValue = products.reduce((sum, product) => {
      const monthStock = Math.floor(product.stock * seasonalEffect[i] * (0.9 + Math.random() * 0.2));
      return sum + (parseFloat(product.price) * monthStock);
    }, 0);
    
    // Calculer le nombre de produits en rupture (simulé)
    // Plus de ruptures pendant les mois de forte demande
    const isHighDemandSeason = highDemandMonths.includes(monthIndex);
    
    // Compter les produits en stock critique (<= 5) comme potentiellement en rupture
    const criticalStockCount = products.filter(p => p.stock <= 5).length;
    
    // Ajuster en fonction de la saison et du hasard
    const baseStockoutRate = isHighDemandSeason ? 0.7 : 0.3; // 70% ou 30% des produits critiques
    let stockouts = Math.floor(criticalStockCount * baseStockoutRate * (0.8 + Math.random() * 0.4));
    
    // S'assurer d'avoir une valeur minimale pour les mois de forte demande
    if (isHighDemandSeason && stockouts < 2) {
      stockouts = 2 + Math.floor(Math.random() * 3); // Au moins 2-4 ruptures
    }
    
    // S'assurer que la tendance générale montre une amélioration dans les derniers mois
    // (moins de ruptures à mesure qu'on se rapproche du présent)
    if (i >= 4) { // Pour les 2 derniers mois
      stockouts = Math.max(0, stockouts - (i - 3) * 2); // Réduire progressivement
    }
    
    monthlyData.push({
      date: monthDate.toISOString().split('T')[0],
      stock: totalStock,
      stockValue: Math.round(totalStockValue * 100) / 100,
      stockouts: stockouts
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return monthlyData;
}