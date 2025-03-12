import React from 'react';
import { Pharmacy } from './PharmacyResultTable';
import { SummaryMetricCard } from '../metrics/SummaryMetricCard';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PharmacySalesTabProps {
  pharmacy: Pharmacy;
}

export function PharmacySalesTab({ pharmacy }: PharmacySalesTabProps) {
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  // Génération de données de ventes simulées
  const generateSalesData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const baseSales = pharmacy.sales / 6; // Répartir sur 6 mois
    
    return months.map((month, index) => {
      // Ajouter une légère variation pour que ce soit plus réaliste
      const variation = 0.8 + Math.random() * 0.4; // entre 80% et 120%
      const monthlySales = Math.round(baseSales * variation);
      const averagePrice = pharmacy.revenue / pharmacy.sales;
      const monthlyRevenue = monthlySales * averagePrice;
      const marginRate = parseFloat(pharmacy.marginRate.replace('%', '')) / 100;
      const monthlyMargin = monthlyRevenue * marginRate;
      
      return {
        name: month,
        sales: monthlySales,
        revenue: monthlyRevenue,
        margin: monthlyMargin
      };
    });
  };

  const salesData = generateSalesData();
  
  // Calcul des tendances (comparer le dernier mois avec la moyenne des mois précédents)
  const lastMonth = salesData[salesData.length - 1];
  const previousMonths = salesData.slice(0, salesData.length - 1);
  const avgSales = previousMonths.reduce((sum, month) => sum + month.sales, 0) / previousMonths.length;
  const avgRevenue = previousMonths.reduce((sum, month) => sum + month.revenue, 0) / previousMonths.length;
  const avgMargin = previousMonths.reduce((sum, month) => sum + month.margin, 0) / previousMonths.length;
  
  const salesTrend = ((lastMonth.sales - avgSales) / avgSales) * 100;
  const revenueTrend = ((lastMonth.revenue - avgRevenue) / avgRevenue) * 100;
  const marginTrend = ((lastMonth.margin - avgMargin) / avgMargin) * 100;

  return (
    <div>
      {/* Graphique des ventes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Évolution des ventes - {pharmacy.name}
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }} 
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4F46E5" 
                strokeWidth={2}
                name="CA"
              />
              <Line 
                type="monotone" 
                dataKey="margin" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Marge"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Métriques de ventes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryMetricCard
          label="Ventes"
          value={`${pharmacy.sales} unités`}
          icon={salesTrend >= 0 ? <FiTrendingUp className="text-emerald-500" /> : <FiTrendingDown className="text-red-500" />}
          valueColor={salesTrend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
        />
        
        <SummaryMetricCard
          label="Chiffre d'affaires"
          value={formatCurrency(pharmacy.revenue)}
          icon={<FiDollarSign className="text-blue-500" />}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        
        <SummaryMetricCard
          label="Marge"
          value={formatCurrency(pharmacy.margin)}
          icon={<FiDollarSign className="text-green-500" />}
          valueColor="text-green-600 dark:text-green-400"
        />
      </div>
      
      {/* Tableau détaillé des ventes mensuelles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg mt-6 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mois
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ventes
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                CA
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Marge
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {salesData.map((month, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {month.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {month.sales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {formatCurrency(month.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {formatCurrency(month.margin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}