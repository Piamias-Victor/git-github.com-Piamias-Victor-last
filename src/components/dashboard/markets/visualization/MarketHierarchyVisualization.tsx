// src/components/dashboard/markets/visualization/MarketHierarchyVisualization.tsx
import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiTrendingUp, FiTrendingDown, FiGrid } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

interface MarketHierarchyVisualizationProps {
  segments: MarketSegment[];
  type: 'universe' | 'category' | 'sub_category' | 'family' | 'sub_family' | 'specificity' | 'lab_distributor' | 'brand_lab' | 'range_name';
  onSegmentSelect: (segment: MarketSegment) => void;
}

export function MarketHierarchyVisualization({ 
  segments, 
  type, 
  onSegmentSelect 
}: MarketHierarchyVisualizationProps) {
  // État pour les nœuds développés
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Formater les valeurs monétaires
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Fonction pour basculer l'état d'expansion d'un segment
  const toggleNode = (segmentId: string) => {
    setExpandedNodes({
      ...expandedNodes,
      [segmentId]: !expandedNodes[segmentId]
    });
  };

  // Déterminer le titre en fonction du type de segment
  const getHierarchyTitle = () => {
    switch (type) {
      case 'universe': return 'Hiérarchie des univers';
      case 'category': return 'Hiérarchie des catégories';
      case 'sub_category': return 'Hiérarchie des sous-catégories';
      case 'family': return 'Hiérarchie des familles';
      case 'sub_family': return 'Hiérarchie des sous-familles';
      case 'lab_distributor': return 'Hiérarchie des distributeurs';
      case 'brand_lab': return 'Hiérarchie des laboratoires';
      case 'range_name': return 'Hiérarchie des gammes';
      default: return 'Hiérarchie des segments';
    }
  };

  // Organiser les segments en hiérarchie
  const organizeHierarchy = () => {
    // Pour les types qui ont une relation parent-enfant claire
    if (['category', 'sub_category', 'family', 'sub_family'].includes(type)) {
      const parentMap: Record<string, MarketSegment[]> = {};
      
      // Grouper par parent
      segments.forEach(segment => {
        const parentKey = segment.parent || 'No Parent';
        if (!parentMap[parentKey]) {
          parentMap[parentKey] = [];
        }
        parentMap[parentKey].push(segment);
      });
      
      return Object.entries(parentMap).map(([parentName, children]) => ({
        name: parentName,
        children: children.sort((a, b) => b.revenue - a.revenue),
        totalRevenue: children.reduce((sum, child) => sum + child.revenue, 0),
        totalProducts: children.reduce((sum, child) => sum + child.products, 0),
      }));
    } 
    
    // Pour les autres types, grouper par taille (chiffre d'affaires)
    const grouped = [
      { name: 'Leaders (>25%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
      { name: 'Importants (10-25%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
      { name: 'Moyens (5-10%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
      { name: 'Petits (<5%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
    ];
    
    // Calculer le chiffre d'affaires total
    const totalRevenue = segments.reduce((sum, segment) => sum + segment.revenue, 0);
    
    // Répartir les segments dans les groupes
    segments.forEach(segment => {
      const share = (segment.revenue / totalRevenue) * 100;
      let groupIndex;
      
      if (share >= 25) groupIndex = 0;
      else if (share >= 10) groupIndex = 1;
      else if (share >= 5) groupIndex = 2;
      else groupIndex = 3;
      
      grouped[groupIndex].children.push(segment);
      grouped[groupIndex].totalRevenue += segment.revenue;
      grouped[groupIndex].totalProducts += segment.products;
    });
    
    // Trier les enfants de chaque groupe par revenus décroissants
    grouped.forEach(group => {
      group.children.sort((a, b) => b.revenue - a.revenue);
    });
    
    // Ne retourner que les groupes qui ont des enfants
    return grouped.filter(group => group.children.length > 0);
  };

  const hierarchy = organizeHierarchy();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
        {getHierarchyTitle()}
      </h3>
      
      <div className="overflow-auto max-h-80">
        {hierarchy.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
              onClick={() => toggleNode(`group-${groupIndex}`)}
            >
              <div className="flex items-center">
                {expandedNodes[`group-${groupIndex}`] 
                  ? <FiChevronDown className="mr-2" /> 
                  : <FiChevronRight className="mr-2" />
                }
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{group.name}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({group.children.length} segments)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(group.totalRevenue)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {group.totalProducts} produits
                </div>
              </div>
            </div>
            
            {expandedNodes[`group-${groupIndex}`] && (
              <div className="mt-2 pl-6 space-y-2">
                {group.children.map((segment) => (
                  <div 
                    key={segment.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 cursor-pointer"
                    onClick={() => onSegmentSelect(segment)}
                  >
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 mr-2">
                        <FiGrid size={16} />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {segment.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(segment.revenue)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {segment.products} produits
                        </div>
                      </div>
                      <div className="flex items-center">
                        {segment.growth.startsWith('-') ? (
                          <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300">
                            <FiTrendingDown size={16} />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
                            <FiTrendingUp size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        Cliquez sur un segment pour en voir le détail
      </div>
    </div>
  );
}