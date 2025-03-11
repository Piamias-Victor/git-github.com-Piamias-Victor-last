import { useState } from "react";
import { FiList, FiGrid } from "react-icons/fi";
import { ProductTableHeader } from "./ProductTableHeader";
import { ProductTableRow } from "./ProductTableRow";

export interface Product {
  id: string;
  ean: string;
  name: string;
  laboratory: string;
  category: string;  // Gardé dans l'interface mais n'est plus affiché dans le tableau principal
  stock: number;
  price: string;
  margin: string;
  marginRate: string;
  sales: number;
}

interface ProductResultTableProps {
  products: Product[];
}

/**
 * Composant d'affichage des résultats de recherche produit
 * Mise à jour pour retirer la colonne Catégorie et utiliser des lignes expansibles
 */
export function ProductResultTable({ products }: ProductResultTableProps) {
  const [viewMode, setViewMode] = useState<'unit' | 'global'>('unit');
  
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Résultats ({products.length})
        </h3>
        <div>
          <button
            onClick={() => setViewMode('unit')}
            className={`mr-2 inline-flex items-center px-3 py-1.5 border rounded-md text-sm ${
              viewMode === 'unit'
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700'
                : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
            }`}
            title="Vue unitaire"
          >
            <FiList className="mr-1" /> Unitaire
          </button>
          <button
            onClick={() => setViewMode('global')}
            className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm ${
              viewMode === 'global'
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700'
                : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
            }`}
            title="Vue globale"
          >
            <FiGrid className="mr-1" /> Globale
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <ProductTableHeader viewMode={viewMode} />
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => (
              <ProductTableRow 
                key={product.id} 
                product={product} 
                viewMode={viewMode} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}