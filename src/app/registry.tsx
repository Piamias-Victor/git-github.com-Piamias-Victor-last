'use client';

import { FiBarChart, FiPackage, FiPieChart, FiTrendingUp, FiDatabase, 
         FiAlertTriangle, FiActivity, FiShoppingCart, 
         FiMinimize} from 'react-icons/fi';

/**
 * Registre centralisé des icônes et des mappings pour l'application
 * 
 * Ce fichier permet de centraliser les mappings et configurations
 * pour faciliter la maintenance et la cohérence.
 */

// Mapping des icônes pour les statistiques
export const StatIconsMap = {
  revenue: <FiBarChart size={24} />,
  margin: <FiTrendingUp size={24} />,
  percentage: <FiPieChart size={24} />,
  products: <FiPackage size={24} />,
  users: <FiShoppingCart size={24} />
};

// Mapping des icônes pour les actions
export const ActionIconsMap = {
  alert: <FiAlertTriangle size={20} />,
  empty: <FiDatabase size={20} />,
  warehouse: <FiPackage size={20} />,
  slow: <FiActivity size={20} />,
  compare: <FiMinimize size={20} />
};

// Mappings des couleurs par priorité
export const PriorityColorsMap = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
};

// Types pour les entrées de données standardisées
export interface StatCardData {
  title: string;
  value: string;
  change?: string;
  icon: keyof typeof StatIconsMap;
}

export interface ActionItemData {
  title: string;
  description?: string;
  count: number;
  icon: keyof typeof ActionIconsMap;
  linkPath: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface NavigationCardData {
  title: string;
  description: string;
  linkPath: string;
  icon: string;
}

// Fonction helper pour déterminer la couleur basée sur le changement
export function getChangeColorClass(change: string | undefined): string {
  if (!change) return "";
  return change.startsWith('+') 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : 'text-red-600 dark:text-red-400';
}