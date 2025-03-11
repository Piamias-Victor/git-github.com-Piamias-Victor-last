'use client';

import React from 'react';
import { FiArrowUp, FiArrowDown, FiTrendingUp, FiBarChart } from 'react-icons/fi';

// Données simulées pour le graphique
const monthlyData = [
  { month: 'Jan', revenue: 8420, margin: 2610 },
  { month: 'Fév', revenue: 9150, margin: 2836 },
  { month: 'Mar', revenue: 8690, margin: 2693 },
  { month: 'Avr', revenue: 9540, margin: 2957 },
  { month: 'Mai', revenue: 10280, margin: 3188 },
  { month: 'Juin', revenue: 11420, margin: 3540 },
];

// Données pour les tops et flops
const topProducts = [
  { name: 'Doliprane 1000mg', sales: 342, evolution: '+8.4%' },
  { name: 'Efferalgan 500mg', sales: 285, evolution: '+4.2%' },
  { name: 'Amoxicilline Biogaran', sales: 210, evolution: '+12.8%' },
];

const flopProducts = [
  { name: 'Spray Nasal Physiomer', sales: 45, evolution: '-15.8%' },
  { name: 'Imodium 2mg', sales: 62, evolution: '-12.3%' },
  { name: 'Nicorette 4mg', sales: 78, evolution: '-6.5%' },
];

/**
 * SummaryCard Component
 */
function SummaryCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * ProductRankingList Component
 */
function ProductRankingList({ 
  products, 
  isPositive 
}: { 
  products: { name: string, sales: number, evolution: string }[],
  isPositive: boolean 
}) {
  return (
    <ul className="space-y-3">
      {products.map((product, index) => (
        <li key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-gray-900 dark:text-white">
              {product.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {product.sales} ventes
            </span>
            <span className={`text-sm ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? <FiArrowUp className="inline mr-1" /> : <FiArrowDown className="inline mr-1" />}
              {product.evolution}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * RevenueChart Component (simplifié)
 */
function RevenueChart() {
  // Dans une vraie application, utilisez Chart.js ou Recharts
  return (
    <div className="mt-2 h-48 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <FiBarChart className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Graphique d'évolution du CA et de la marge
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Visualisation avec Chart.js à implémenter
        </p>
      </div>
    </div>
  );
}

/**
 * GlobalSummary Component
 * 
 * Résumé global des performances avec visualisations.
 */
export function GlobalSummary() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Aperçu global des performances
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <SummaryCard title="Évolution CA et marge - 6 derniers mois">
          <RevenueChart />
        </SummaryCard>
        
        <div className="grid grid-cols-1 gap-6">
          <SummaryCard title="Top produits">
            <ProductRankingList products={topProducts} isPositive={true} />
          </SummaryCard>
          
          <SummaryCard title="Produits en baisse">
            <ProductRankingList products={flopProducts} isPositive={false} />
          </SummaryCard>
        </div>
      </div>
    </div>
  );
}