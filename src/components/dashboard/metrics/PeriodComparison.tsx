// src/components/dashboard/metrics/PeriodComparison.tsx
import React from 'react';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';

interface PeriodComparisonProps {
  currentValue: number;
  previousValue: number;
  format?: 'percentage' | 'currency' | 'number';
  inverse?: boolean; // Si true, une diminution est positive (ex: pour les coûts)
  precision?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Composant affichant la variation entre deux périodes
 * Avec formatage et code couleur
 */
export function PeriodComparison({
  currentValue,
  previousValue,
  format = 'number',
  inverse = false,
  precision = 1,
  prefix = '',
  suffix = ''
}: PeriodComparisonProps) {
  // Éviter la division par zéro
  if (previousValue === 0) {
    return (
      <span className="text-gray-500 dark:text-gray-400 text-xs">N/A</span>
    );
  }

  // Calculer la différence et le pourcentage de variation
  const difference = currentValue - previousValue;
  const percentChange = (difference / Math.abs(previousValue)) * 100;
  
  // Déterminer si c'est une augmentation ou une diminution
  const isIncrease = difference > 0;
  // Pour les métriques inverses (où une baisse est positive)
  const isPositive = inverse ? !isIncrease : isIncrease;
  
  // Formater la différence selon le type demandé
  let formattedDiff = '';
  switch (format) {
    case 'percentage':
      formattedDiff = `${difference >= 0 ? '+' : ''}${difference.toFixed(precision)}%`;
      break;
    case 'currency':
      formattedDiff = `${difference >= 0 ? '+' : ''}${prefix}${Math.abs(difference).toFixed(precision)}${suffix}`;
      break;
    case 'number':
    default:
      formattedDiff = `${difference >= 0 ? '+' : ''}${prefix}${difference.toFixed(precision)}${suffix}`;
      break;
  }

  // Classes de couleur en fonction de la direction et du type (normal ou inverse)
  const colorClass = isPositive 
    ? "text-emerald-600 dark:text-emerald-400" 
    : "text-red-600 dark:text-red-400";

  // Icône à afficher
  const Icon = isIncrease 
    ? FiArrowUp 
    : difference < 0 
      ? FiArrowDown 
      : FiMinus;

  return (
    <div className="flex items-center">
      <span className={`inline-flex items-center ${colorClass}`}>
        <Icon className="mr-1" size={14} />
        <span className="font-medium">{formattedDiff}</span>
      </span>
      <span className="text-gray-500 dark:text-gray-400 ml-1 text-xs">
        ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
      </span>
    </div>
  );
}