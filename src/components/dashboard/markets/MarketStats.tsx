// src/components/dashboard/markets/MarketStats.tsx
import React, { useState } from 'react';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiPieChart, 
  FiPackage, 
  FiUsers, 
  FiGrid, 
  FiLayers,
  FiArrowUp,
  FiArrowDown,
  FiInfo
} from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

interface MarketStatsProps {
  segments: MarketSegment[];
  type: 'universe' | 'category' | 'sub_category' | 'family' | 'sub_family' | 'specificity' | 'lab_distributor' | 'brand_lab' | 'range_name';
}

export function MarketStats({ segments, type }: MarketStatsProps) {
  const [showComposition, setShowComposition] = useState(false);
  
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
  
  // Identifier les laboratoires uniques
  const uniqueLabs = Object.keys(labsMap);
  
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
  
  // Extraire les segments en croissance/décroissance
  const growingSegments = segments.filter(s => !s.growth.startsWith('-'));
  const decliningSegments = segments.filter(s => s.growth.startsWith('-'));
  
  // Extraire les parents uniques pour les catégories/familles
  const extractParents = () => {
    const parents: Record<string, number> = {};
    
    segments.forEach(segment => {
      if (segment.parent) {
        parents[segment.parent] = (parents[segment.parent] || 0) + 1;
      }
    });
    
    return Object.entries(parents)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };
  
  const topParents = extractParents();
  
  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Obtenir le titre approprié pour le type de segment
  const getSegmentTypeTitle = () => {
    switch (type) {
      case 'universe': return 'Univers';
      case 'category': return 'Catégories';
      case 'sub_category': return 'Sous-catégories';
      case 'family': return 'Familles';
      case 'sub_family': return 'Sous-familles';
      case 'specificity': return 'Spécificités';
      case 'lab_distributor': return 'Distributeurs';
      case 'brand_lab': return 'Laboratoires/Marques';
      case 'range_name': return 'Gammes';
      default: return 'Segments';
    }
  };
  
  // Calculer la distribution des données (uniquement pour certains types)
  const calculateDistribution = () => {
    if (type === 'universe' || type === 'category' || type === 'family') {
      // Trouver la distribution par catégorie
      const distributions: Record<string, { count: number, percentage: number }> = {};
      
      switch(type) {
        case 'universe':
          // Pour les univers, montrer la répartition des catégories
          segments.forEach(segment => {
            distributions[segment.name] = {
              count: segment.products,
              percentage: (segment.revenue / totalRevenue) * 100
            };
          });
          break;
        case 'category':
        case 'family':
          // Pour les catégories/familles, montrer la répartition par parent
          topParents.forEach(([parent, count]) => {
            const parentSegments = segments.filter(s => s.parent === parent);
            const parentRevenue = parentSegments.reduce((sum, s) => sum + s.revenue, 0);
            
            distributions[parent] = {
              count: count,
              percentage: (parentRevenue / totalRevenue) * 100
            };
          });
          break;
      }
      
      return distributions;
    }
    
    return null;
  };
  
  const distribution = calculateDistribution();

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* Carte principale avec les métriques-clés améliorées */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Statistiques globales
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
            {getSegmentTypeTitle()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
          <StatCardImproved 
            title="Marché total"
            value={formatCurrency(totalRevenue)}
            subtitle="Chiffre d'affaires cumulé"
            icon={<FiBarChart2 size={20} />}
            colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
            highlight={true}
          />
          <StatCardImproved 
            title="Croissance"
            value={`${weightedGrowth >= 0 ? '+' : ''}${weightedGrowth.toFixed(1)}%`}
            subtitle="Évolution pondérée"
            icon={<FiTrendingUp size={20} />}
            colorClass={`${weightedGrowth >= 0 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'}`}
            highlight={weightedGrowth > 5 || weightedGrowth < -5}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard 
            title="Segments" 
            value={segments.length.toString()} 
            subtitle={`Nombre total`}
            icon={<FiGrid size={18} />}
            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
          />
          <StatCard 
            title="Produits" 
            value={totalProducts.toString()} 
            subtitle="Références actives"
            icon={<FiPackage size={18} />}
            colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
          />
          <StatCard 
            title="En hausse" 
            value={growingSegments.length.toString()} 
            subtitle={`${Math.round((growingSegments.length / segments.length) * 100)}% du total`}
            icon={<FiArrowUp size={18} />}
            colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300"
          />
          <StatCard 
            title="En baisse" 
            value={decliningSegments.length.toString()} 
            subtitle={`${Math.round((decliningSegments.length / segments.length) * 100)}% du total`}
            icon={<FiArrowDown size={18} />}
            colorClass="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
          />
        </div>
        
        {/* Composition - expéandable */}
        <div className="mt-4">
          <button 
            onClick={() => setShowComposition(!showComposition)}
            className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <FiLayers className="mr-1.5" size={16} />
            {showComposition ? "Masquer la composition" : "Voir la composition"}
          </button>
          
          {showComposition && (
          <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Composition détaillée
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Structure du marché
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Laboratoires:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{uniqueLabs.length}</span>
                  </div>
                  
                  {type !== 'universe' && topParents.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {type === 'category' || type === 'sub_category' ? 'Univers:' : 
                        type === 'family' || type === 'sub_family' ? 'Catégories:' : 'Parents:'}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{topParents.length}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Moyennes par segment
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Produits:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {Math.round(totalProducts / segments.length)} par segment
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">CA moyen:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {formatCurrency(totalRevenue / segments.length)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {distribution && Object.keys(distribution).length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                  {type === 'universe' ? 'Répartition du chiffre d\'affaires par univers' : 
                  type === 'category' ? 'Répartition par univers parent' : 
                  'Répartition par catégorie parente'}
                </h5>
                
                <div className="space-y-3">
                  {Object.entries(distribution)
                    .sort((a, b) => b[1].percentage - a[1].percentage)
                    .slice(0, 4)
                    .map(([name, { count, percentage }], index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]" title={name}>
                            {name}
                          </span>
                          <div className="flex items-center">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400 mr-2">
                              {percentage.toFixed(1)}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {count} produit{count > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                          <div 
                            className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      
      {/* Carte avec les indicateurs avancés - redesignée */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Indicateurs avancés
        </h3>
        
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="flex items-start">
            <FiInfo className="text-indigo-500 mt-0.5 mr-2" size={16} />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Ces indicateurs permettent d'évaluer la structure et la concentration du marché,
              essentiels pour définir votre stratégie commerciale.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {dominantLab && (
            <AdvancedStatImproved
              title="Laboratoire leader"
              value={dominantLab}
              subtitle={`${Math.round((maxLabRevenue / totalRevenue) * 100)}% de part de marché`}
              secondaryValue={formatCurrency(maxLabRevenue)}
              icon={<FiUsers size={20} />}
              colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
            />
          )}
          
          {topSegment && (
            <AdvancedStatImproved
              title="Segment leader"
              value={topSegment.name}
              subtitle={`${concentration.toFixed(1)}% du marché`}
              secondaryValue={formatCurrency(topSegment.revenue)}
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
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interprétation
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getMarketAnalysisText(concentration, calculateHHI(segments), segments.length)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Carte des segments analysés */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Segments analysés
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {segments.length} {getSegmentTypeTitle().toLowerCase()} au total
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.slice(0, 6).map((segment) => (
            <div 
              key={segment.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white truncate" title={segment.name}>
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
                  <div className="flex items-center justify-end">
                    {segment.growth.startsWith('-') ? (
                      <FiArrowDown className="text-red-500 mr-1" size={14} />
                    ) : (
                      <FiArrowUp className="text-green-500 mr-1" size={14} />
                    )}
                    <p className={`text-sm ${segment.growth.startsWith('-') 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'}`}
                    >
                      {segment.growth}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Part: {segment.marketShare}
                </span>
                {segment.dominantLab && segment.dominantLab !== 'N/A' && (
                  <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[130px]" title={segment.dominantLab}>
                    {segment.dominantLab}
                  </span>
                )}
              </div>
              
              {segment.parent && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate" title={segment.parent}>
                  Parent: {segment.parent}
                </div>
              )}
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
      <div className="text-base font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {subtitle}
      </div>
    </div>
  );
}

// Version améliorée de StatCard avec mise en évidence
interface StatCardImprovedProps extends StatCardProps {
  highlight?: boolean;
}

function StatCardImproved({ title, value, subtitle, icon, colorClass, highlight = false }: StatCardImprovedProps) {
  return (
    <div className={`p-4 ${highlight 
      ? 'bg-indigo-50 dark:bg-indigo-900/20' 
      : 'bg-gray-50 dark:bg-gray-700/50'} rounded-lg`}
    >
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-full ${colorClass} mr-3`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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

// Version améliorée avec valeur secondaire
interface AdvancedStatImprovedProps extends AdvancedStatProps {
  secondaryValue?: string;
}

function AdvancedStatImproved({ 
  title, 
  value, 
  subtitle, 
  icon, 
  colorClass,
  secondaryValue 
}: AdvancedStatImprovedProps) {
  return (
    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className={`p-2 rounded-full mr-3 ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </div>
        <div className="font-semibold text-gray-900 dark:text-white truncate" title={value}>
          {value}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      </div>
      {secondaryValue && (
        <div className="text-right ml-2">
          <div className="font-semibold text-indigo-600 dark:text-indigo-400">
            {secondaryValue}
          </div>
        </div>
      )}
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

// Générer un texte d'analyse de marché basé sur les indicateurs
function getMarketAnalysisText(concentration: number, hhi: number, segmentCount: number): string {
  let analysisText = '';
  
  if (concentration > 75) {
    analysisText = `Ce marché présente une forte concentration avec un acteur dominant contrôlant ${concentration.toFixed(1)}% des parts. Ceci suggère une structure oligopolistique ou quasi-monopolistique. Les stratégies de niche ou de différenciation sont recommandées pour les acteurs secondaires.`;
  } else if (concentration > 50) {
    analysisText = `Le marché montre une concentration significative avec un acteur principal détenant ${concentration.toFixed(1)}% des parts. Dans ce type de marché, les alliances stratégiques et l'innovation peuvent être des leviers importants pour les challengers.`;
  } else if (concentration > 25) {
    analysisText = `Le marché présente une concentration modérée (${concentration.toFixed(1)}%), indiquant une compétition active entre plusieurs acteurs significatifs. Les stratégies de différenciation et de segmentation client sont particulièrement pertinentes.`;
  } else {
    analysisText = `Le marché est relativement fragmenté avec une faible concentration (${concentration.toFixed(1)}%), ce qui indique une compétition intense entre de nombreux acteurs. Les stratégies de consolidation ou de spécialisation sont à considérer.`;
  }
  
  // Ajouter des commentaires sur l'indice HHI
  if (hhi > 2500) {
    analysisText += ` L'indice HHI de ${hhi.toFixed(0)} confirme un marché très concentré, où les effets d'échelle jouent un rôle crucial.`;
  } else if (hhi > 1500) {
    analysisText += ` Avec un HHI de ${hhi.toFixed(0)}, ce marché présente une concentration modérée à élevée, offrant des opportunités pour des stratégies de croissance ciblées.`;
  } else {
    analysisText += ` Le faible indice HHI (${hhi.toFixed(0)}) confirme la fragmentation du marché, où l'acquisition de parts nécessitera probablement une approche différenciante.`;
  }
  
  return analysisText;
}