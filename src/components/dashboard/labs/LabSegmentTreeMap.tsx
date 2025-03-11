// src/components/dashboard/labs/visualization/LabSegmentTreeMap.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';
import { Card } from '@/components/ui/Card';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

// Types pour les données du TreeMap
interface TreeMapData {
  name: string;
  value: number;
  children?: TreeMapData[];
  color?: string;
}

// Props du composant
interface LabSegmentTreeMapProps {
  laboratories: Laboratory[];
  allProducts: Product[];
  isLoading?: boolean;
  error?: string | null;
}

// Type des segments
type SegmentType = 'universe' | 'category' | 'family' | 'range';

// Couleurs pour les différents niveaux
const COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', 
  '#D97706', '#BE185D', '#6366F1', '#65A30D'
];

export function LabSegmentTreeMap({
  laboratories,
  allProducts,
  isLoading = false,
  error = null
}: LabSegmentTreeMapProps) {
  const [activeSegment, setActiveSegment] = useState<SegmentType>('universe');

  // Filtrer les produits des laboratoires sélectionnés
  const labProducts = useMemo(() => 
    allProducts.filter(product => 
      laboratories.some(lab => lab.name === product.laboratory)
    )
  , [allProducts, laboratories]);

  // Générer les données du TreeMap selon le segment actif
  const treeMapData = useMemo(() => {
    if (!labProducts.length) return { name: 'Segments', children: [] };

    // Fonction pour grouper les produits par segment
    const groupProductsBySegment = (segmentType: SegmentType) => {
      const segmentField = segmentType === 'range' ? 'range_name' : segmentType;
      const segments: Record<string, Product[]> = {};
      
      labProducts.forEach(product => {
        const segmentValue = product[segmentField] || 'Non défini';
        if (!segments[segmentValue]) {
          segments[segmentValue] = [];
        }
        segments[segmentValue].push(product);
      });
      
      return Object.entries(segments).map(([name, products], index) => ({
        name,
        value: products.length,
        color: COLORS[index % COLORS.length],
        products
      }));
    };
    
    const segments = groupProductsBySegment(activeSegment);
    
    return {
      name: 'Segments',
      children: segments
    };
  }, [labProducts, activeSegment]);

  // Gérer les états de chargement et d'erreur
  if (isLoading) return <LoadingState height="60" message="Analyse des segments en cours..." />;
  if (error) return <ErrorState message={error} />;
  if (labProducts.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 dark:text-gray-400">
        Aucun produit trouvé pour les laboratoires sélectionnés
      </div>
    );
  }

  // Définir les onglets pour les différents types de segments
  const tabs: TabItem[] = [
    {
      id: 'universe',
      label: 'Univers',
      content: (
        <div className="h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treeMapData.children}
              dataKey="value"
              ratio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomTreemapContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      id: 'category',
      label: 'Catégories',
      content: (
        <div className="h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treeMapData.children}
              dataKey="value"
              ratio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomTreemapContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      id: 'family',
      label: 'Familles',
      content: (
        <div className="h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treeMapData.children}
              dataKey="value"
              ratio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomTreemapContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      id: 'range',
      label: 'Gammes',
      content: (
        <div className="h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treeMapData.children}
              dataKey="value"
              ratio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomTreemapContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      )
    }
  ];

  // Gérer le changement d'onglet
  const handleTabChange = (tabId: string) => {
    setActiveSegment(tabId as SegmentType);
  };

  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Segments des laboratoires
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{labProducts.length}</span> produits analysés
          </div>
        </div>
        
        <Tabs 
          tabs={tabs} 
          defaultTab="universe" 
          onTabChange={handleTabChange}
        />
      </div>
    </Card>
  );
}

// Composant pour afficher le contenu de chaque cellule du TreeMap
function CustomTreemapContent(props: any) {
  const { x, y, width, height, name, value, color } = props;
  
  if (width < 30 || height < 30) return null;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: width < 50 ? '10px' : width < 100 ? '12px' : '14px',
          fontWeight: 'bold',
          fill: '#fff',
          pointerEvents: 'none',
        }}
      >
        {width > 60 ? name : ''}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '10px',
          fill: '#fff',
          pointerEvents: 'none',
        }}
      >
        {width > 60 ? `${value} produits` : ''}
      </text>
    </g>
  );
}

// Composant pour afficher le tooltip au survol
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-gray-600 dark:text-gray-300">{data.value} produits</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {((data.value / payload[0].root.children.reduce((sum: number, item: any) => sum + item.value, 0)) * 100).toFixed(1)}% du total
        </p>
      </div>
    );
  }
  
  return null;
}