// src/components/dashboard/products/comparison/PharmacyMetricsCards.tsx
import React from 'react';
import { PharmacyRadarData, MetricDetailData } from './types';

interface PharmacyMetricsCardsProps {
  pharmacy: PharmacyRadarData | undefined;
  metricDetails: Record<string, MetricDetailData>;
}

// Composant de carte métrique détaillée
interface DetailedMetricCardProps {
  label: string;
  metricKey: string;
  metricData: MetricDetailData;
  unit?: string;
  isHigherBetter?: boolean;
}

// Composant de carte métrique détaillée
function DetailedMetricCard({ label, metricKey, metricData, unit = '', isHigherBetter = true }: DetailedMetricCardProps) {
  const { yourValue, percentage, groupAvg, groupMax, groupMin } = metricData;
  
  const getValueColor = (value: number, isHigher: boolean) => {
    if (isHigher) {
      return value >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
    } else {
      return value <= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
    }
  };
  
  const valueColor = getValueColor(percentage, isHigherBetter);
  
  // Formater les nombres pour éviter les décimales inutiles
  const formatNumber = (num: number) => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</h4>
        <span className={`text-sm font-semibold ${valueColor}`}>{percentage}%</span>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Votre valeur:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatNumber(yourValue)}{unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Moyenne:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatNumber(groupAvg)}{unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Maximum:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatNumber(groupMax)}{unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Minimum:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatNumber(groupMin)}{unit}</span>
        </div>
      </div>
    </div>
  );
}

export function PharmacyMetricsCards({ pharmacy, metricDetails }: PharmacyMetricsCardsProps) {
  // Simplifier les vérifications
  const hasData = metricDetails && Object.keys(metricDetails).length > 0;
  
  if (!hasData || !pharmacy) {
    return (
      <div className="grid md:grid-cols-1 gap-4 mb-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
            Sélectionnez "Votre pharmacie" dans la légende pour voir les statistiques détaillées
          </p>
        </div>
      </div>
    );
  }
  
  // Sécuriser l'accès aux données de métrique
  const metricsKeys = ['price', 'margin', 'rotation', 'stock', 'sales'];
  const hasMissingMetrics = metricsKeys.some(key => !metricDetails[key]);
  
  if (hasMissingMetrics) {
    return (
      <div className="grid md:grid-cols-1 gap-4 mb-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
            Certaines données de métriques sont manquantes
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-5 gap-4 mb-4">
      <DetailedMetricCard 
        label="Prix" 
        metricKey="price" 
        metricData={metricDetails.price} 
        unit="€"
        isHigherBetter={false}
      />
      <DetailedMetricCard 
        label="Marge" 
        metricKey="margin" 
        metricData={metricDetails.margin}
        unit="€"
      />
      <DetailedMetricCard 
        label="Rotation" 
        metricKey="rotation" 
        metricData={metricDetails.rotation}
        unit="x"
      />
      <DetailedMetricCard 
        label="Stock" 
        metricKey="stock" 
        metricData={metricDetails.stock}
        unit=""
        isHigherBetter={false}
      />
      <DetailedMetricCard 
        label="Ventes" 
        metricKey="sales" 
        metricData={metricDetails.sales}
        unit=""
      />
    </div>
  );
}