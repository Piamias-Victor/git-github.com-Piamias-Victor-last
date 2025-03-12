// src/components/dashboard/products/StickyHeaderNav.tsx
import React from 'react';
import { ProductSearch } from '@/components/dashboard/products/ProductSearch';
import { Product } from './ProductResultTable';
import { FiFilter } from 'react-icons/fi';
import { ProductSectionNav } from './ProductSectionNav';

interface StickyHeaderNavProps {
  onSearch: (results: any[]) => void;
  activeFilter: {type: string, value: string} | null;
  filterTitle: string;
  clearFilter: () => void;
  showNavigation: boolean;
  activeSection: string;
}

/**
 * Composant pour afficher une barre de recherche et la navigation qui reste fixe
 * au haut de l'écran pendant le défilement
 */
export function StickyHeaderNav({ 
  onSearch, 
  activeFilter,
  filterTitle,
  clearFilter,
  showNavigation,
  activeSection
}: StickyHeaderNavProps) {
  return (
    <div className="sticky rounded-xl top-0 z-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="space-y-4 p-4">
        {/* Affichage du filtre actif s'il y en a un */}
        {activeFilter && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FiFilter className="text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-indigo-700 dark:text-indigo-300">
                  Filtre actif: {filterTitle}
                </span>
              </div>
              <button 
                onClick={clearFilter}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Effacer le filtre
              </button>
            </div>
          </div>
        )}

        {/* Barre de recherche si aucun filtre n'est actif */}
        {!activeFilter && (
          <div id="search-container">
            <ProductSearch onSearch={onSearch} />
          </div>
        )}
        
        {/* Navigation par sections - apparaît seulement quand il y a des résultats */}
          <div className="mt-2">
            <ProductSectionNav activeSection={activeSection} />
          </div>
      </div>
    </div>
  );
}