import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Treemap 
} from 'recharts';

// Interface pour les types de produits
interface Product {
  id: string;
  name: string;
  growth: number;
  value: number;
  universe: string;
}

interface SegmentData {
  name: string;
  value: number;
  color: string;
  universe?: string;
}

// Composant pour afficher la liste des tops et flops
const ProductRankingList: React.FC<{ products: Product[], isPositive: boolean }> = ({ products, isPositive }) => {
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div key={product.id} className="flex justify-between items-center py-1">
          <div className="text-sm text-gray-700 dark:text-gray-300 truncate pr-4 max-w-[70%]">
            {product.name}
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
              {product.value.toLocaleString()} €
            </span>
            <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{product.growth}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const UNIVERSE_COLORS = {
  'Médicaments': '#4F46E5',
  'Dermopharmacie': '#10B981',
  'Bien-être': '#F59E0B',
  'Bébé & Puériculture': '#EF4444',
  'Autres': '#8B5CF6'
};


// Composant du graphique de segmentation (TreeMap)
const SegmentTreeMap = () => {
  // Types de segments possibles
  type SegmentType = 'univers' | 'categories' | 'familles';
  const [currentSegment, setCurrentSegment] = useState<SegmentType>('univers');

  // Données simulées pour les différents segments
  const segmentData: Record<SegmentType, SegmentData[]> = {
    univers: [
      { name: 'Médicaments', value: 45, color: UNIVERSE_COLORS['Médicaments'], universe: 'Médicaments' },
      { name: 'Dermopharmacie', value: 25, color: UNIVERSE_COLORS['Dermopharmacie'], universe: 'Dermopharmacie' },
      { name: 'Bien-être', value: 15, color: UNIVERSE_COLORS['Bien-être'], universe: 'Bien-être' },
      { name: 'Bébé & Puériculture', value: 10, color: UNIVERSE_COLORS['Bébé & Puériculture'], universe: 'Bébé & Puériculture' },
      { name: 'Autres', value: 5, color: UNIVERSE_COLORS['Autres'], universe: 'Autres' }
    ],
    categories: [
      { name: 'Douleur & Fièvre', value: 30, color: UNIVERSE_COLORS['Médicaments'], universe: 'Médicaments' },
      { name: 'Dermatologie', value: 20, color: UNIVERSE_COLORS['Dermopharmacie'], universe: 'Dermopharmacie' },
      { name: 'Système Digestif', value: 15, color: UNIVERSE_COLORS['Bien-être'], universe: 'Bien-être' },
      { name: 'Antibiotiques', value: 12, color: UNIVERSE_COLORS['Médicaments'], universe: 'Médicaments' },
      { name: 'Autres', value: 23, color: UNIVERSE_COLORS['Autres'], universe: 'Autres' }
    ],
    familles: [
      { name: 'Antalgiques', value: 22, color: UNIVERSE_COLORS['Médicaments'], universe: 'Médicaments' },
      { name: 'Anti-inflammatoires', value: 18, color: UNIVERSE_COLORS['Médicaments'], universe: 'Médicaments' },
      { name: 'Antibiotiques', value: 15, color: UNIVERSE_COLORS['Médicaments'], universe: 'Médicaments' },
      { name: 'Crèmes dermatologiques', value: 12, color: UNIVERSE_COLORS['Dermopharmacie'], universe: 'Dermopharmacie' },
      { name: 'Autres', value: 33, color: UNIVERSE_COLORS['Autres'], universe: 'Autres' }
    ]
  };

  // Trier les segments par valeur décroissante
  const sortedSegments = [...segmentData[currentSegment]].sort((a, b) => b.value - a.value);

  return (
    <div className="h-full flex flex-col">
      {/* Sélecteur de segments */}
      <div className="flex justify-center mb-3">
        <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
          {(['univers', 'categories', 'familles'] as SegmentType[]).map((segment) => (
            <button
              key={segment}
              onClick={() => setCurrentSegment(segment)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                currentSegment === segment 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-full flex">
        {/* TreeMap à gauche */}
        <div className="w-1/2 pr-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Répartition par {currentSegment}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <Treemap
              data={segmentData[currentSegment]}
              dataKey="value"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                  borderRadius: '0.375rem'
                }}
                formatter={(value, name, props) => {
                  const percentage = ((value as any / segmentData[currentSegment].reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
                  return [`${value} (${percentage}%)`, name];
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* Top segments à droite */}
        <div className="w-1/2 pl-4 border-l border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Top 5 {currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1)}
          </h4>
          <div className="space-y-2">
            {sortedSegments.map((segment, index) => (
              <div key={segment.name} className="flex items-center">
                <div 
                  className="w-4 h-4 mr-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <div className="flex-grow flex justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {segment.name}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {segment.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// Composant du graphique d'évolution CA et marge
const RevenueChart = () => {
  // Données simulées pour les 6 derniers mois
  const data = [
    { date: '2024-10-01', revenue: 28500, margin: 9100, marginPercentage: 31.9 },
    { date: '2024-11-01', revenue: 31200, margin: 10550, marginPercentage: 33.8 },
    { date: '2024-12-01', revenue: 35800, margin: 12350, marginPercentage: 34.5 },
    { date: '2025-01-01', revenue: 26400, margin: 8250, marginPercentage: 31.2 },
    { date: '2025-02-01', revenue: 29700, margin: 9850, marginPercentage: 33.1 },
    { date: '2025-03-01', revenue: 32500, margin: 10920, marginPercentage: 33.6 },
  ];
  
  // Définition des séries pour le graphique
  const revenueSeries = [
    { dataKey: "revenue", name: "CA (€)", color: "#4F46E5" },
    { dataKey: "margin", name: "Marge (€)", color: "#10B981" },
    { dataKey: "marginPercentage", name: "Taux (%)", color: "#F59E0B" }
  ];

  // Fonction pour formater les dates sur l'axe X
  const formatChartDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'short' });
  };
  
  // Fonction pour formater la date dans le tooltip
  const formatTooltipDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Formater les valeurs pour l'affichage
  const formatValue = (value: number) => {
    return `${value.toLocaleString()} €`;
  };

  // Formatter pour le tooltip
  const customTooltipFormatter = (value: number, name: string) => {
    if (name === "revenue") return [`${formatValue(value)}`, "CA"];
    if (name === "margin") return [`${formatValue(value)}`, "Marge"];
    if (name === "marginPercentage") return [`${value.toFixed(1)}%`, "Taux"];
    return [value, name];
  };

  return (
    <div className="h-72">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Évolution des ventes
        </h4>
        <div className="flex space-x-3">
          {revenueSeries.map(serie => (
            <div key={serie.dataKey} className="flex items-center text-xs">
              <span 
                className="w-3 h-3 rounded-full mr-1.5" 
                style={{ backgroundColor: serie.color }}
              ></span>
              <span className="text-gray-600 dark:text-gray-400">{serie.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatChartDate}
            stroke="#6B7280"
          />
          <YAxis 
            yAxisId="left" 
            stroke="#6B7280" 
            tickFormatter={(value) => `${Math.round(value / 1000)}k€`} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#6B7280" 
            tickFormatter={(value) => `${value}%`}
            domain={[0, 40]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderColor: '#E5E7EB',
              color: '#111827',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }} 
            formatter={customTooltipFormatter}
            labelFormatter={formatTooltipDate}
          />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            name="CA (€)"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="margin"
            name="Marge (€)"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="marginPercentage"
            name="Taux (%)"
            stroke="#F59E0B"
            strokeDasharray="3 3"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        Données cumulées sur les 6 derniers mois
      </div>
    </div>
  );
};

// Données simulées pour les top produits
const topProducts: Product[] = [
  { id: 'p1', name: 'Doliprane 1000mg', growth: 12.4, value: 3850, universe: 'Médicaments' },
  { id: 'p2', name: 'Efferalgan 500mg', growth: 8.7, value: 2920, universe: 'Médicaments' },
  { id: 'p3', name: 'Amoxicilline Biogaran', growth: 15.2, value: 2750, universe: 'Médicaments' },
  { id: 'p4', name: 'Daflon 500mg', growth: 6.9, value: 1980, universe: 'Médicaments' },
  { id: 'p5', name: 'Voltarène Gel 2%', growth: 9.5, value: 1840, universe: 'Médicaments' },
];

// Données simulées pour les produits en baisse
const flopProducts: Product[] = [
  { id: 'p6', name: 'Nurofen 400mg', growth: -8.3, value: 1250, universe: 'Médicaments' },
  { id: 'p7', name: 'Gaviscon Menthe', growth: -12.5, value: 980, universe: 'Bien-être' },
  { id: 'p8', name: 'Dulcolax 5mg', growth: -7.2, value: 840, universe: 'Médicaments' },
  { id: 'p9', name: 'Rhinofluimucil Spray', growth: -15.4, value: 720, universe: 'Bien-être' },
  { id: 'p10', name: 'Smecta Fraise', growth: -5.8, value: 680, universe: 'Médicaments' },
];

// Composant principal de résumé global
export function GlobalSummary() {
  // Calcul des métriques
  const metrics = {
    totalQuantity: 7980,
    totalRevenue: 184100,
    totalMargin: 61020,
    marginRate: 33.1,
    quantityTrend: 4.3,
    revenueTrend: 5.7,
    marginTrend: 6.8
  };

  return (
    <div className="mb-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Aperçu global des performances
      </h2>
      
      {/* Ligne de statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantité</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {metrics.totalQuantity.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            +{metrics.quantityTrend}%
          </p>
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CA total</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {metrics.totalRevenue.toLocaleString()} €
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            +{metrics.revenueTrend}%
          </p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Marge</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {metrics.totalMargin.toLocaleString()} €
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            +{metrics.marginTrend}%
          </p>
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Taux</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {metrics.marginRate.toFixed(1)}%
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            +1.2 pts
          </p>
        </div>
      </div>
      
      {/* Graphiques principaux */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Graphique de revenus */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <RevenueChart />
        </div>
        
        {/* Univers et top univers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-[450px]">
          <SegmentTreeMap />
        </div>
      </div>
      
      {/* Top produits et produits en baisse côte à côte */}
      <div className="grid md:grid-cols-2 gap-6">
        <SummaryCard title="Top produits">
          <ProductRankingList products={topProducts} isPositive={true} />
        </SummaryCard>
        
        <SummaryCard title="Produits en baisse">
          <ProductRankingList products={flopProducts} isPositive={false} />
        </SummaryCard>
      </div>
    </div>
  );
}

// Composant SummaryCard si non défini ailleurs
interface SummaryCardProps {
  title: string;
  children: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
};