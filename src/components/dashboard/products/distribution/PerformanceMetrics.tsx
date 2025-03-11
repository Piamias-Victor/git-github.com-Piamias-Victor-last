// src/components/dashboard/products/distribution/PerformanceMetrics.tsx
import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import { Product } from '../ProductResultTable';
import { useProductPerformanceData } from './useProductPerformanceData';
import { SummaryMetricCard } from '@/components/dashboard/metrics/SummaryMetricCard';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';

interface PerformanceMetricsProps {
  product: Product;
}

export function PerformanceMetrics({ product }: PerformanceMetricsProps) {
  const { data, isLoading, error } = useProductPerformanceData(product);
  
  if (isLoading) return <LoadingState height="20" message="Chargement des métriques de performance..." />;
  if (error) return <ErrorState message={error} />;
  
  if (!data) return null;
  
  // Déterminer les couleurs et tendances en fonction des valeurs
  const getSalesRankColor = (rank: number, total: number) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 10) return "green"; // Top 10%
    if (percentage <= 25) return "emerald"; // Top 25%
    if (percentage <= 50) return "blue"; // Top 50%
    return "amber"; // Reste
  };
  
  const getGrowthColor = (growth: number) => {
    if (growth >= 10) return "green"; // Croissance forte
    if (growth > 0) return "emerald"; // Croissance positive
    if (growth >= -5) return "amber"; // Légère baisse
    return "red"; // Baisse significative
  };
  
  const getMarginComparisonColor = (diff: number) => {
    if (diff >= 5) return "green"; // Bien supérieur
    if (diff > 0) return "emerald"; // Supérieur
    if (diff >= -5) return "amber"; // Légèrement inférieur
    return "red"; // Très inférieur
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Performance dans la catégorie et le laboratoire
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <SummaryMetricCard
          label="Classement catégorie"
          value={`${data.categoryRank}/${data.categoryTotal}`}
          valueColor={`text-${getSalesRankColor(data.categoryRank, data.categoryTotal)}-600 dark:text-${getSalesRankColor(data.categoryRank, data.categoryTotal)}-400`}
          icon={<FiActivity className="text-blue-500" size={18} />}
        />
        
        <SummaryMetricCard
          label="Classement laboratoire"
          value={`${data.labRank}/${data.labTotal}`}
          valueColor={`text-${getSalesRankColor(data.labRank, data.labTotal)}-600 dark:text-${getSalesRankColor(data.labRank, data.labTotal)}-400`}
          icon={<FiActivity className="text-purple-500" size={18} />}
        />
        
        <SummaryMetricCard
          label="Évolution vs catégorie"
          value={`${data.categoryGrowthDiff >= 0 ? '+' : ''}${data.categoryGrowthDiff}%`}
          valueColor={`text-${getGrowthColor(data.categoryGrowthDiff)}-600 dark:text-${getGrowthColor(data.categoryGrowthDiff)}-400`}
          icon={data.categoryGrowthDiff >= 0 ? 
            <FiTrendingUp className="text-emerald-500" size={18} /> : 
            <FiTrendingDown className="text-red-500" size={18} />
          }
        />
        
        <SummaryMetricCard
          label="Marge vs moyenne"
          value={`${data.marginDiff >= 0 ? '+' : ''}${data.marginDiff}%`}
          valueColor={`text-${getMarginComparisonColor(data.marginDiff)}-600 dark:text-${getMarginComparisonColor(data.marginDiff)}-400`}
          icon={data.marginDiff >= 0 ? 
            <FiTrendingUp className="text-emerald-500" size={18} /> : 
            <FiTrendingDown className="text-red-500" size={18} />
          }
        />
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="font-medium mb-1">Analyse comparative:</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>Ce produit se situe dans le <span className={`font-medium text-${getSalesRankColor(data.categoryRank, data.categoryTotal)}-600 dark:text-${getSalesRankColor(data.categoryRank, data.categoryTotal)}-400`}>top {Math.round((data.categoryRank / data.categoryTotal) * 100)}%</span> des ventes de sa catégorie</li>
          <li>Sa croissance est <span className={`font-medium text-${getGrowthColor(data.categoryGrowthDiff)}-600 dark:text-${getGrowthColor(data.categoryGrowthDiff)}-400`}>{data.categoryGrowthDiff > 0 ? 'supérieure' : 'inférieure'}</span> de {Math.abs(data.categoryGrowthDiff)}% à la moyenne de sa catégorie</li>
          <li>Sa marge est <span className={`font-medium text-${getMarginComparisonColor(data.marginDiff)}-600 dark:text-${getMarginComparisonColor(data.marginDiff)}-400`}>{data.marginDiff > 0 ? 'supérieure' : 'inférieure'}</span> de {Math.abs(data.marginDiff)}% à la moyenne des produits similaires</li>
        </ul>
      </div>
    </div>
  );
}