import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Product } from './ProductResultTable';

interface ProductCategoryDistributionProps {
  products: Product[];
}

interface CategoryData {
  name: string;
  value: number;
  count: number;
}

// Couleurs pour les catégories
const COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#6366F1', // Purple
  '#14B8A6', // Teal
];

export function ProductCategoryDistribution({ products }: ProductCategoryDistributionProps) {
  // Calculer la distribution par catégorie (à la fois en nombre et en valeur)
  const categoryData = useMemo(() => {
    if (!products.length) return [];

    // Initialiser la structure pour stocker les données par catégorie
    const categoriesMap = new Map<string, CategoryData>();

    // Parcourir tous les produits
    products.forEach(product => {
      const category = product.category || 'Non catégorisé';
      const value = parseFloat(product.price) * product.sales; // CA total
      
      if (categoriesMap.has(category)) {
        // Mettre à jour une catégorie existante
        const existingCategory = categoriesMap.get(category)!;
        existingCategory.value += value;
        existingCategory.count += 1;
      } else {
        // Créer une nouvelle entrée
        categoriesMap.set(category, {
          name: category,
          value: value,
          count: 1
        });
      }
    });

    // Convertir Map en tableau et trier par valeur décroissante
    return Array.from(categoriesMap.values())
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        value: Math.round(item.value * 100) / 100 // Arrondir à 2 décimales
      }));
  }, [products]);

  if (products.length === 0) return null;

  // Calculer le nombre total de produits et le CA total
  const totalProducts = products.length;
  const totalValue = categoryData.reduce((sum, category) => sum + category.value, 0);
  
  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Répartition par catégorie
      </h4>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Graphique en camembert */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), 'CA']} 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  color: '#111827',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Tableau des données */}
        <div className="overflow-hidden">
          <div className="mb-2 flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total: {totalProducts} produits</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">CA total: {formatCurrency(totalValue)}</span>
          </div>
          
          <div className="overflow-y-auto max-h-72">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Catégorie
                  </th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Produits
                  </th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    CA
                  </th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categoryData.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-2 whitespace-nowrap text-xs">
                      <div className="flex items-center">
                        <span 
                          className="w-2 h-2 rounded-full inline-block mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        {category.name}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
                      {category.count} ({((category.count / totalProducts) * 100).toFixed(1)}%)
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-medium">
                      {formatCurrency(category.value)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
                      {((category.value / totalValue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}