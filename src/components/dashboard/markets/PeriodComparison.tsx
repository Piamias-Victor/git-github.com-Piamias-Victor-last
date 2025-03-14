// src/components/dashboard/metrics/PeriodComparison.tsx
import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface PeriodComparisonProps {
  currentValue: number;
  previousValue: number;
  precision?: number;
  format?: 'percentage' | 'currency' | 'number';
  reverseColors?: boolean; // Pour les cas où une baisse est positive (ex: coûts)
}

/**
 * Composant pour afficher la comparaison entre deux périodes
 * Utilisé principalement dans les KPIs pour montrer l'évolution
 */
export function PeriodComparison({
  currentValue,
  previousValue,
  precision = 1,
  format = 'percentage',
  reverseColors = false
}: PeriodComparisonProps) {
  // Éviter la division par zéro
  if (previousValue === 0) {
    return null;
  }

  // Calculer la différence
  const difference = currentValue - previousValue;
  const percentChange = (difference / Math.abs(previousValue)) * 100;
  
  // Déterminer si la tendance est positive ou négative
  const isPositive = reverseColors 
    ? difference < 0
    : difference > 0;
  
  // Formater la valeur selon le format demandé
  const formattedChange = format === 'percentage'
    ? `${isPositive ? '+' : ''}${percentChange.toFixed(precision)}%`
    : format === 'currency'
      ? `${isPositive ? '+' : ''}${difference.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`
      : `${isPositive ? '+' : ''}${difference.toFixed(precision)}`;

  return (
    <div className={`flex items-center ${
      isPositive 
        ? 'text-emerald-600 dark:text-emerald-400' 
        : 'text-red-600 dark:text-red-400'
    }`}>
      {isPositive ? (
        <FiArrowUp className="mr-1" size={12} />
      ) : (
        <FiArrowDown className="mr-1" size={12} />
      )}
      <span className="text-xs font-medium">{formattedChange}</span>
    </div>
  );
}