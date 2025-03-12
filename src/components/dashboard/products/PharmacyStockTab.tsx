import React from 'react';
import { Pharmacy } from './PharmacyResultTable';
import { SummaryMetricCard } from '../metrics/SummaryMetricCard';
import { FiAlertTriangle, FiPackage, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PharmacyStockTabProps {
  pharmacy: Pharmacy;
}

export function PharmacyStockTab({ pharmacy }: PharmacyStockTabProps) {
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  // Génération de données de stock simulées
  const generateStockData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const categories = [
      { name: 'Douleur & Fièvre', percent: 0.25 },
      { name: 'Vitamines', percent: 0.20 },
      { name: 'Digestion', percent: 0.15 },
      { name: 'Bien-être', percent: 0.12 },
      { name: 'Autres', percent: 0.28 }
    ];
    
    // Données mensuelles de stock
    const monthlyData = months.map((month, index) => {
      // Simuler une évolution du stock au cours des mois
      const variation = 0.85 + (index * 0.05) + (Math.random() * 0.1);
      const totalStock = Math.round(pharmacy.stock * variation);
      
      // Calculer le nombre de produits à stock critique
      const criticalStockPercent = 0.05 + (Math.random() * 0.05);
      const criticalStock = Math.round(totalStock * criticalStockPercent);
      
      // Simuler la valeur du stock
      const avgValue = pharmacy.revenue / pharmacy.products;
      const stockValue = totalStock * avgValue;
      
      return {
        name: month,
        stock: totalStock,
        criticalStock: criticalStock,
        stockValue: stockValue
      };
    });
    
    // Répartition par catégorie
    const categoryData = categories.map(cat => ({
      name: cat.name,
      value: Math.round(pharmacy.stock * cat.percent)
    }));
    
    return { monthlyData, categoryData };
  };

  const { monthlyData, categoryData } = generateStockData();
  
  // Calculer des indicateurs
  const stockTurnover = (pharmacy.sales / pharmacy.stock).toFixed(1);
  const stockCoverage = Math.round(pharmacy.stock / (pharmacy.sales / 30)); // en jours
  const criticalStockPercent = Math.round((monthlyData[monthlyData.length - 1].criticalStock / monthlyData[monthlyData.length - 1].stock) * 100);

  return (
    <div>
      {/* Graphique de stock */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Évolution du stock - {pharmacy.name}
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
              />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                orientation="left"
              />
              <YAxis 
                yAxisId="right"
                stroke="#6B7280"
                orientation="right"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }} 
                formatter={(value: number, name: string) => {
                  if (name === 'stockValue') return [formatCurrency(value), 'Valeur'];
                  if (name === 'criticalStock') return [value, 'Stock critique'];
                  return [value, 'Quantité'];
                }}
              />
              <Bar 
                dataKey="stock" 
                name="Quantité" 
                fill="#4F46E5" 
                yAxisId="left"
              />
              <Bar 
                dataKey="criticalStock" 
                name="Stock critique" 
                fill="#EF4444" 
                yAxisId="left"
              />
              <Bar 
                dataKey="stockValue" 
                name="Valeur" 
                fill="#10B981" 
                yAxisId="right"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Métriques de stock */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryMetricCard
          label="Stock total"
          value={`${pharmacy.stock} unités`}
          icon={<FiPackage className="text-blue-500" />}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        
        <SummaryMetricCard
          label="Rotation"
          value={`${stockTurnover}x`}
          icon={stockTurnover >= 3 ? <FiTrendingUp className="text-emerald-500" /> : <FiTrendingDown className="text-amber-500" />}
          valueColor={stockTurnover >= 3 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}
        />
        
        <SummaryMetricCard
          label="Couverture"
          value={`${stockCoverage} jours`}
          icon={stockCoverage <= 45 ? <FiPackage className="text-emerald-500" /> : <FiPackage className="text-amber-500" />}
          valueColor={stockCoverage <= 45 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}
        />
        
        <SummaryMetricCard
          label="Stock critique"
          value={`${criticalStockPercent}%`}
          icon={<FiAlertTriangle className="text-red-500" />}
          valueColor="text-red-600 dark:text-red-400"
        />
      </div>
      
      {/* Répartition par catégorie */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Répartition du stock par catégorie
        </h3>
        
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégorie
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quantité
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % du stock
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {categoryData.map((category, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {category.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {((category.value / pharmacy.stock) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}