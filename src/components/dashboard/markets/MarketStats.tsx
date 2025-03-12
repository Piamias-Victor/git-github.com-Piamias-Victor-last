// src/components/dashboard/markets/MarketStats.tsx
import React from 'react';
import { FiBarChart2, FiTrendingUp, FiPieChart, FiPackage, FiUsers, FiGrid } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

interface MarketStatsProps {
  segments: MarketSegment[];
  type: 'universe' | 'category' | 'sub_category' | 'family' | 'sub_family' | 'specificity' | 'lab_distributor' | 'brand_lab' | 'range_name';
}

export function MarketStats({ segments, type }: MarketStatsProps) {
  // Calculer les statistiques agrégées
  const totalProducts = segments.reduce((sum, segment) => sum + segment.products, 0);
  const totalRevenue = segments.reduce((sum, segment) => sum + segment.revenue, 0);
  
  // Calculer la croissance moyenne pondérée par le chiffre d'affaires
  const weightedGrowth = segments.reduce((sum, segment) => {
    const growthValue = parseFloat(segment.growth.replace('%', '').replace('+', ''));
    return sum + (growthValue * segment.revenue);
  }, 0) / (totalRevenue || 1); // Éviter division par zéro
  
  // Trouver le laboratoire dominant
  const labsMap: Record<string, number> = {};
  segments.forEach(segment => {
    if (segment.dominantLab && segment.dominantLab !== 'N/A') {
      labsMap[segment.dominantLab] = (labsMap[segment.dominantLab] || 0) + segment.revenue;
    }
  });
  
  let dominantLab = '';
  let maxLabRevenue = 0;
  Object.entries(labsMap).forEach(([lab, revenue]) => {
    if (revenue > maxLabRevenue) {
      maxLabRevenue = revenue;
      dominantLab = lab;
    }
  });
  
  // Calculer la concentration du marché (pour le top segment)
  const topSegment = segments.sort((a, b) => b.revenue - a.revenue)[0] || null;
  const concentration = topSegment ? (topSegment.revenue / totalRevenue) * 100 : 0;
  
  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* Carte principale avec les métriques-clés */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Statistiques globales
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Segments" 
            value={segments.length.toString()} 
            subtitle={`Nombre de ${type}`}
            icon={<FiGrid size={20} />}
            colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
          />
          <StatCard 
            title="Produits" 
            value={totalProducts.toString()} 
            subtitle="Produits actifs"
            icon={<FiPackage size={20} />}
            colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
          />
          <StatCard 
            title="CA" 
            value={formatCurrency(totalRevenue)} 
            subtitle="Chiffre d'affaires"
            icon={<FiBarChart2 size={20} />}
            colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
          />
          <StatCard 
            title="Croissance" 
            value={`${weightedGrowth >= 0 ? '+' : ''}${weightedGrowth.toFixed(1)}%`} 
            subtitle="Moyenne pondérée"
            icon={<FiTrendingUp size={20} />}
            colorClass={`${weightedGrowth >= 0 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'}`}
          />
        </div>
      </div>
      
      {/* Carte avec les indicateurs avancés */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Indicateurs avancés
        </h3>
        <div className="space-y-4">
          {dominantLab && (
            <AdvancedStat
              title="Laboratoire dominant"
              value={dominantLab}
              subtitle={`${Math.round((maxLabRevenue / totalRevenue) * 100)}% de part de marché`}
              icon={<FiUsers size={20} />}
              colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
            />
          )}
          
          {topSegment && (
            <AdvancedStat
              title="Segment principal"
              value={topSegment.name}
              subtitle={`${concentration.toFixed(1)}% du marché (${formatCurrency(topSegment.revenue)})`}
              icon={<FiPieChart size={20} />}
              colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
            />
          )}
          
          <AdvancedStat
            title="Concentration du marché"
            value={getConcentrationLevel(concentration)}
            subtitle={`Indice HHI: ${calculateHHI(segments).toFixed(0)} points`}
            icon={<FiPieChart size={20} />}
            colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
          />
        </div>
      </div>
      
      {/* Carte des segments analysés */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Segments analysés
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {segments.length} {type} au total
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.slice(0, 6).map((segment) => (
            <div 
              key={segment.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {segment.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {segment.products} produits
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(segment.revenue)}
                  </p>
                  <p className={`text-sm ${segment.growth.startsWith('-') 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'}`}
                  >
                    {segment.growth}
                  </p>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Part de marché: {segment.marketShare}
                </span>
                {segment.dominantLab && segment.dominantLab !== 'N/A' && (
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {segment.dominantLab}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {segments.length > 6 && (
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              + {segments.length - 6} autres segments non affichés
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour afficher une statistique simple
interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ title, value, subtitle, icon, colorClass }: StatCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className={`p-2 rounded-full mb-2 ${colorClass}`}>
        {icon}
      </div>
      <div className="text-lg font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {subtitle}
      </div>
    </div>
  );
}

// Composant pour afficher une statistique avancée
interface AdvancedStatProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
}

function AdvancedStat({ title, value, subtitle, icon, colorClass }: AdvancedStatProps) {
  return (
    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className={`p-2 rounded-full mr-3 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </div>
        <div className="font-semibold text-gray-900 dark:text-white">
          {value}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

// Fonctions utilitaires
function getConcentrationLevel(concentration: number): string {
  if (concentration > 75) return 'Très concentré';
  if (concentration > 50) return 'Concentré';
  if (concentration > 25) return 'Modérément concentré';
  return 'Peu concentré';
}

// Calcul de l'indice Herfindahl-Hirschman (HHI) de concentration du marché
function calculateHHI(segments: MarketSegment[]): number {
  const totalRevenue = segments.reduce((sum, segment) => sum + segment.revenue, 0);
  
  // Calculer le carré des parts de marché en pourcentage
  const squaredShares = segments.map(segment => {
    const share = (segment.revenue / totalRevenue) * 100;
    return share * share;
  });
  
  // Sommer les carrés des parts de marché
  return squaredShares.reduce((sum, share) => sum + share, 0);
}