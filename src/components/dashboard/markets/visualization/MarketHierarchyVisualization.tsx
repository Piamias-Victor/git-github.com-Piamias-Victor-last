// src/components/dashboard/markets/visualization/MarketHierarchyVisualization.tsx
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiTrendingUp, FiTrendingDown, FiGrid } from 'react-icons/fi';
import { HierarchyGroup } from './HierarchyGroup';

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

  // Fonction pour basculer l'état d'expansion d'un segment
  const toggleNode = (segmentId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [segmentId]: !prev[segmentId]
    }));
  };

  // Déterminer le titre en fonction du type de segment
// Dans MarketHierarchyVisualization.tsx
// Modifiez votre objet titles pour inclure la clé "specificity"

const getHierarchyTitle = () => {
  const titles = {
    'universe': 'Hiérarchie des univers',
    'category': 'Hiérarchie des catégories',
    'sub_category': 'Hiérarchie des sous-catégories',
    'family': 'Hiérarchie des familles',
    'sub_family': 'Hiérarchie des sous-familles',
    'specificity': 'Hiérarchie des spécificités', // Ajoutez cette ligne
    'lab_distributor': 'Hiérarchie des distributeurs',
    'brand_lab': 'Hiérarchie des laboratoires',
    'range_name': 'Hiérarchie des gammes'
  };
  return titles[type] || 'Hiérarchie des segments';
};

  // Obtenir les groupes hiérarchiques organisés
  const hierarchy = organizeHierarchy(segments, type);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
        {getHierarchyTitle()}
      </h3>
      
      <div className="overflow-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {hierarchy.map((group, index) => (
          <HierarchyGroup 
            key={`group-${index}`}
            group={group}
            groupId={`group-${index}`}
            isExpanded={!!expandedNodes[`group-${index}`]}
            onToggle={toggleNode}
            onSegmentSelect={onSegmentSelect}
          />
        ))}
      </div>
      
      <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
        Cliquez sur un segment pour en voir le détail
      </div>
    </div>
  );
}

// Fonction utilitaire pour organiser les segments en hiérarchie
function organizeHierarchy(segments: MarketSegment[], type: string) {
  // Pour les types qui ont une relation parent-enfant claire
  if (['category', 'sub_category', 'family', 'sub_family'].includes(type)) {
    const parentMap: Record<string, MarketSegment[]> = {};
    
    // Grouper par parent
    segments.forEach(segment => {
      const parentKey = segment.parent || 'Sans parent';
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
  const totalRevenue = segments.reduce((sum, segment) => sum + segment.revenue, 0);
  
  const groups = [
    { name: 'Leaders (>25%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
    { name: 'Importants (10-25%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
    { name: 'Moyens (5-10%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
    { name: 'Petits (<5%)', children: [] as MarketSegment[], totalRevenue: 0, totalProducts: 0 },
  ];
  
  // Répartir les segments dans les groupes
  segments.forEach(segment => {
    const share = (segment.revenue / totalRevenue) * 100;
    const groupIndex = share >= 25 ? 0 : share >= 10 ? 1 : share >= 5 ? 2 : 3;
    
    groups[groupIndex].children.push(segment);
    groups[groupIndex].totalRevenue += segment.revenue;
    groups[groupIndex].totalProducts += segment.products;
  });
  
  // Trier les enfants de chaque groupe et ne retourner que les groupes non vides
  return groups
    .map(group => ({
      ...group,
      children: group.children.sort((a, b) => b.revenue - a.revenue)
    }))
    .filter(group => group.children.length > 0);
}