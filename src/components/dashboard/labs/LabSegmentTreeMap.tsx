// src/components/dashboard/labs/visualization/LabSegmentTreeMap.tsx
import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { TreeMapData } from './useSegmentData';

interface LabSegmentTreeMapProps {
  treeMapData: {
    name: string;
    children: TreeMapData[];
  };
}

export function LabSegmentTreeMap({ treeMapData }: LabSegmentTreeMapProps) {
  if (!treeMapData.children.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={treeMapData.children}
        dataKey="value"
        aspectRatio={4/3}
        stroke="#fff"
        content={<CustomTreemapContent />}
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
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
    
    // Calculer le total des valeurs
    let total = 0;
    if (payload[0].root) {
      // Si root est un tableau, on somme directement
      if (Array.isArray(payload[0].root)) {
        total = payload[0].root.reduce((sum: number, item: any) => sum + item.value, 0);
      } 
      // Si root a un children, on somme les children
      else if (payload[0].root.children) {
        total = payload[0].root.children.reduce((sum: number, item: any) => sum + item.value, 0);
      }
    }

    // Si on n'a pas pu calculer le total, on utilise simplement la valeur
    const percentage = total ? ((data.value / total) * 100).toFixed(1) : '100';
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-gray-600 dark:text-gray-300">{data.value} produits</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {percentage}% du total
        </p>
      </div>
    );
  }
  
  return null;
}