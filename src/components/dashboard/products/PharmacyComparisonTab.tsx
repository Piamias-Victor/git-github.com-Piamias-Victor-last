import React from 'react';
import { Pharmacy } from './PharmacyResultTable';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis, Tooltip, Legend } from 'recharts';
import { SummaryMetricCard } from '../metrics/SummaryMetricCard';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface PharmacyComparisonTabProps {
  pharmacy: Pharmacy;
}


interface ComparativeMetricProps {
    label: string;
    value: number | string;
    average: number | string;
    percentage: string | number;
    isMonetary?: boolean;
  }

export function PharmacyComparisonTab({ pharmacy }: PharmacyComparisonTabProps) {
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  // Générer les données de comparaison simulées
  const generateComparisonData = () => {
    // Données radar pour la comparaison entre la pharmacie et le groupe
    const getPerformancePercentage = (actual: number, average: number) => {
      return (actual / average) * 100;
    };

    // Moyennes simulées du groupe
    const groupAverages = {
      products: 115,
      stock: 350,
      revenue: 12000,
      margin: 3600,
      sales: 260,
      marginRate: 30
    };

    // Calculer les pourcentages de performance
    const productsPerf = getPerformancePercentage(pharmacy.products, groupAverages.products);
    const stockPerf = getPerformancePercentage(pharmacy.stock, groupAverages.stock);
    const revenuePerf = getPerformancePercentage(pharmacy.revenue, groupAverages.revenue);
    const marginPerf = getPerformancePercentage(pharmacy.margin, groupAverages.margin);
    const salesPerf = getPerformancePercentage(pharmacy.sales, groupAverages.sales);
    const marginRatePerf = getPerformancePercentage(parseFloat(pharmacy.marginRate.replace('%', '')), groupAverages.marginRate);

    // Données pour le graphique radar
    const radarData = [
      { subject: 'Produits', A: productsPerf, B: 100, fullMark: 150 },
      { subject: 'Stock', A: stockPerf, B: 100, fullMark: 150 },
      { subject: 'CA', A: revenuePerf, B: 100, fullMark: 150 },
      { subject: 'Marge', A: marginPerf, B: 100, fullMark: 150 },
      { subject: 'Ventes', A: salesPerf, B: 100, fullMark: 150 },
      { subject: 'Taux de marge', A: marginRatePerf, B: 100, fullMark: 150 }
    ];

    // Détails des métriques
    const metrics = {
      products: {
        value: pharmacy.products,
        avgValue: groupAverages.products,
        percentage: productsPerf.toFixed(1)
      },
      stock: {
        value: pharmacy.stock,
        avgValue: groupAverages.stock,
        percentage: stockPerf.toFixed(1)
      },
      revenue: {
        value: pharmacy.revenue,
        avgValue: groupAverages.revenue,
        percentage: revenuePerf.toFixed(1)
      },
      margin: {
        value: pharmacy.margin,
        avgValue: groupAverages.margin,
        percentage: marginPerf.toFixed(1)
      },
      sales: {
        value: pharmacy.sales,
        avgValue: groupAverages.sales,
        percentage: salesPerf.toFixed(1)
      },
      marginRate: {
        value: parseFloat(pharmacy.marginRate.replace('%', '')),
        avgValue: groupAverages.marginRate,
        percentage: marginRatePerf.toFixed(1)
      }
    };

    return { radarData, metrics };
  };

  const { radarData, metrics } = generateComparisonData();

  // Composant pour une métrique comparative
  const ComparativeMetric = ({ label, value, average, percentage, isMonetary = false } : ComparativeMetricProps) => {
    const formattedValue = isMonetary ? formatCurrency(value as any) : value;
    const formattedAvg = isMonetary ? formatCurrency(average as any) : average;
    const isPositive = Number(percentage) >= 100;
    const Icon = isPositive ? FiArrowUp : FiArrowDown;
    const colorClass = isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</h4>
          <div className={`flex items-center ${colorClass}`}>
            <Icon className="mr-1" size={14} />
            <span>{percentage}%</span>
          </div>
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">{formattedValue}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Moyenne: {formattedAvg}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-6">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          Cette analyse compare les performances de la pharmacie {pharmacy.name} par rapport à la moyenne du groupement.
          Les valeurs sont exprimées en pourcentage (100% = moyenne du groupement).
        </p>
      </div>
      
      {/* Graphique radar de comparaison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Comparaison avec la moyenne du groupement
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={radarData}>
              <PolarGrid stroke="#374151" opacity={0.2} />
              <PolarAngleAxis dataKey="subject" stroke="#6B7280" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#6B7280" />
              <Radar
                name={pharmacy.name}
                dataKey="A"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.5}
              />
              <Radar
                name="Moyenne groupement"
                dataKey="B"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, '']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827'
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Métriques détaillées */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ComparativeMetric
          label="Produits"
          value={metrics.products.value}
          average={metrics.products.avgValue}
          percentage={metrics.products.percentage}
        />
        
        <ComparativeMetric
          label="Stock"
          value={metrics.stock.value}
          average={metrics.stock.avgValue}
          percentage={metrics.stock.percentage}
        />
        
        <ComparativeMetric
          label="Ventes"
          value={metrics.sales.value}
          average={metrics.sales.avgValue}
          percentage={metrics.sales.percentage}
        />
        
        <ComparativeMetric
          label="Chiffre d'affaires"
          value={metrics.revenue.value}
          average={metrics.revenue.avgValue}
          percentage={metrics.revenue.percentage}
          isMonetary={true}
        />
        
        <ComparativeMetric
          label="Marge"
          value={metrics.margin.value}
          average={metrics.margin.avgValue}
          percentage={metrics.margin.percentage}
          isMonetary={true}
        />
        
        <ComparativeMetric
          label="Taux de marge"
          value={`${metrics.marginRate.value}%`}
          average={`${metrics.marginRate.avgValue}%`}
          percentage={metrics.marginRate.percentage}
        />
      </div>
      
      {/* Recommandations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Recommandations
        </h3>
        
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {Number(metrics.stock.percentage) > 120 && (
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 mr-2 flex-shrink-0">!</span>
              <span>Votre stock est supérieur de {metrics.stock.percentage}% à la moyenne. Envisagez d'optimiser votre gestion des stocks pour réduire les coûts.</span>
            </li>
          )}
          
          {Number(metrics.marginRate.percentage) < 95 && (
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300 mr-2 flex-shrink-0">!</span>
              <span>Votre taux de marge est inférieur à la moyenne. Analysez votre politique tarifaire et votre mix-produit.</span>
            </li>
          )}
          
          {Number(metrics.products.percentage) < 90 && (
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 mr-2 flex-shrink-0">!</span>
              <span>Votre gamme de produits est inférieure à la moyenne. Envisagez d'élargir votre offre pour attirer plus de clients.</span>
            </li>
          )}
          
          {Number(metrics.revenue.percentage) > 110 && (
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 mr-2 flex-shrink-0">✓</span>
              <span>Votre chiffre d'affaires est supérieur à la moyenne. Continuez à développer cette dynamique positive.</span>
            </li>
          )}
          
          {Number(metrics.sales.percentage) < 100 && Number(metrics.revenue.percentage) > 100 && (
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 mr-2 flex-shrink-0">i</span>
              <span>Vos ventes sont inférieures à la moyenne mais votre CA est supérieur. Vous vendez moins mais à plus forte valeur ajoutée.</span>
            </li>
          )}
          
          {Number(metrics.sales.percentage) > 110 && Number(metrics.marginRate.percentage) < 95 && (
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 mr-2 flex-shrink-0">!</span>
              <span>Vous réalisez un volume de ventes important mais avec un taux de marge inférieur. Évaluez votre stratégie de prix.</span>
            </li>
          )}
          
          {Number(metrics.stock.percentage) < 85 && Number(metrics.sales.percentage) > 110 && (
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 mr-2 flex-shrink-0">!</span>
              <span>Votre niveau de stock est faible par rapport à vos ventes. Attention aux risques de rupture de stock.</span>
            </li>
          )}
        </ul>
      </div>
      
      {/* Analyse des opportunités */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Opportunités d'optimisation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Points forts</h4>
            <ul className="space-y-1 text-sm text-green-600 dark:text-green-300">
              {Number(metrics.revenue.percentage) > 105 && (
                <li>• Bonne performance en chiffre d'affaires</li>
              )}
              {Number(metrics.marginRate.percentage) > 105 && (
                <li>• Taux de marge supérieur à la moyenne</li>
              )}
              {Number(metrics.sales.percentage) > 105 && (
                <li>• Volume de ventes élevé</li>
              )}
              {Number(metrics.products.percentage) > 105 && (
                <li>• Gamme de produits diversifiée</li>
              )}
              {Number(metrics.stock.percentage) < 95 && Number(metrics.sales.percentage) > 95 && (
                <li>• Bonne optimisation des stocks</li>
              )}
            </ul>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">Axes d'amélioration</h4>
            <ul className="space-y-1 text-sm text-amber-600 dark:text-amber-300">
              {Number(metrics.marginRate.percentage) < 95 && (
                <li>• Optimiser la politique tarifaire</li>
              )}
              {Number(metrics.stock.percentage) > 115 && (
                <li>• Réduire les niveaux de stock</li>
              )}
              {Number(metrics.stock.percentage) < 85 && (
                <li>• Renforcer les niveaux de stock</li>
              )}
              {Number(metrics.products.percentage) < 95 && (
                <li>• Élargir la gamme de produits</li>
              )}
              {Number(metrics.sales.percentage) < 95 && (
                <li>• Améliorer les volumes de vente</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}