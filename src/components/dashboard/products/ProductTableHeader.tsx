import React from 'react';

interface ProductTableHeaderProps {
  viewMode: 'unit' | 'global';
}

/**
 * Composant pour l'en-tête du tableau de résultats de produits
 * Sans la colonne catégorie
 */
export function ProductTableHeader({ viewMode }: ProductTableHeaderProps) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-900/50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Code EAN
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Produit
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Laboratoire
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Stock
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {viewMode === 'unit' ? 'Prix TTC' : 'CA TTC'}
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {viewMode === 'unit' ? 'Marge' : 'Marge Totale'}
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Taux
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Ventes
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Détails
        </th>
      </tr>
    </thead>
  );
}