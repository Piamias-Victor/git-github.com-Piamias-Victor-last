// src/components/dashboard/markets/visualization/MarketTreeMap.tsx
import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

interface MarketTreeMapProps {
  segments: MarketSegment[];
  type: 'universe' | 'category' | 'sub_category' | 'family' | 'sub_family' | 'specificity' | 'lab_distributor' | 'brand_lab' | 'range_name';
  onSegmentSelect: (segment: MarketSegment) => void;
}

export function MarketTreeMap({ segments, type, onSegmentSelect }: MarketTreeMapProps) {
  // Convertir les segments au format attendu par Recharts
  const treeMapData = {
    name: 'Segments',
    children: segments.map((segment, index) => ({
      name: segment.name,
      size: segment.revenue,
      value: segment.revenue,
      marketShare: segment.marketShare,
      growth: segment.growth,
      products: segment.products,
      dominantLab: segment.dominantLab,
      id: segment.id,
      // Couleurs différentes en fonction de la croissance
      color: getColorByGrowth(segment.growth),
      originalData: segment
    }))
  };

  // Formater les valeurs monétaires
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
        Répartition du marché par {type === 'universe' ? 'univers' : 
          type === 'category' ? 'catégorie' : 
          type === 'family' ? 'famille' : 
          type === 'lab_distributor' ? 'distributeur' : 
          type === 'brand_lab' ? 'laboratoire' : 
          'segment'}
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treeMapData.children}
            dataKey="value"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomTreemapContent onSegmentSelect={onSegmentSelect} />}
          >
            <Tooltip 
              content={<CustomTooltip formatter={formatCurrency} />}
              wrapperStyle={{ zIndex: 100 }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 flex justify-center items-center">
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full inline-block mr-1 bg-red-500"></span>
            <span className="text-gray-600 dark:text-gray-300">En déclin</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full inline-block mr-1 bg-yellow-500"></span>
            <span className="text-gray-600 dark:text-gray-300">Stable</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full inline-block mr-1 bg-green-500"></span>
            <span className="text-gray-600 dark:text-gray-300">En croissance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher le contenu de chaque cellule du TreeMap
interface CustomTreemapContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  colors?: string[];
  name?: string;
  value?: number;
  marketShare?: string;
  growth?: string;
  products?: number;
  dominantLab?: string;
  id?: string;
  color?: string;
  originalData?: MarketSegment;
  onSegmentSelect: (segment: MarketSegment) => void;
}

function CustomTreemapContent({
  root, depth, x, y, width, height, index, name, value, 
  marketShare, growth, products, dominantLab, id, color,
  originalData, onSegmentSelect
}: CustomTreemapContentProps) {
  if (!width || !height || width < 0 || height < 0) return null;
  
  // Si la cellule est trop petite, n'afficher que le rectangle coloré
  if (width < 30 || height < 30) {
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
            cursor: 'pointer'
          }}
          onClick={() => originalData && onSegmentSelect(originalData)}
        />
      </g>
    );
  }

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
          cursor: 'pointer'
        }}
        onClick={() => originalData && onSegmentSelect(originalData)}
      />
      <text
        x={x! + width! / 2}
        y={y! + height! / 2 - 7}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: width! < 50 ? '10px' : width! < 100 ? '12px' : '14px',
          fontWeight: 'bold',
          fill: getContrastText(color || '#000'),
          pointerEvents: 'none',
        }}
      >
        {name}
      </text>
      <text
        x={x! + width! / 2}
        y={y! + height! / 2 + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '10px',
          fill: getContrastText(color || '#000'),
          pointerEvents: 'none',
        }}
      >
        {marketShare}
      </text>
    </g>
  );
}

// Composant pour afficher un tooltip personnalisé
function CustomTooltip({ active, payload, formatter }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-gray-600 dark:text-gray-300">
          CA: {formatter(data.value)}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Part de marché: {data.marketShare}
        </p>
        <p className={`${data.growth.startsWith('-') 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-green-600 dark:text-green-400'}`}
        >
          Croissance: {data.growth}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Produits: {data.products}
        </p>
        {data.dominantLab && data.dominantLab !== 'N/A' && (
          <p className="text-gray-600 dark:text-gray-300">
            Labo principal: {data.dominantLab}
          </p>
        )}
      </div>
    );
  }
  
  return null;
}

// Fonction pour déterminer la couleur en fonction de la croissance
function getColorByGrowth(growth: string): string {
  const growthValue = parseFloat(growth.replace('%', '').replace('+', ''));
  
  if (growthValue < 0) return '#EF4444'; // Rouge pour décroissance
  if (growthValue < 3) return '#F59E0B'; // Jaune pour croissance faible/stable
  if (growthValue < 7) return '#10B981'; // Vert pour bonne croissance
  return '#059669'; // Vert foncé pour forte croissance
}

// Fonction pour déterminer la couleur du texte (blanc ou noir) selon la couleur de fond
function getContrastText(bgColor: string): string {
  // Convertir la couleur hex en RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculer la luminosité (formule standard)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Retourner blanc ou noir selon la luminosité
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}