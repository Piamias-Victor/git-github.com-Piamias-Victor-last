// src/components/dashboard/products/StickyHeaderNav.tsx
import React, { useState } from 'react';
import { ProductSearch } from '@/components/dashboard/products/ProductSearch';
import { ProductSectionNav } from '@/components/dashboard/products/ProductSectionNav';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';

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
 * au haut de l'écran pendant le défilement, avec une option pour cacher/montrer
 * la barre de recherche
 */
export function StickyHeaderNav({ 
  onSearch, 
  activeFilter,
  filterTitle,
  clearFilter,
  showNavigation,
  activeSection
}: StickyHeaderNavProps) {
  const [showSearchBar, setShowSearchBar] = useState(true);

  // Fonction pour basculer l'affichage de la barre de recherche
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };
  
  return (
    <div className="sticky rounded-xl top-0 z-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="space-y-4 p-4">
        {/* Bouton pour afficher/masquer la barre de recherche */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {showNavigation ? 'Navigation par section' : 'Recherche de produits'}
          </h3>
          <div className="flex items-center space-x-2">
            {activeFilter && (
              <div className="flex items-center bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1.5 rounded-md">
                <FiFilter className="mr-1.5" size={16} />
                <span className="text-sm font-medium">{filterTitle}</span>
                <button
                  onClick={clearFilter}
                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
            <button
              onClick={toggleSearchBar}
              className="flex items-center px-3 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
            >
              {showSearchBar ? (
                <>
                  <FiX className="mr-1.5" size={16} />
                  Masquer la recherche
                </>
              ) : (
                <>
                  <FiSearch className="mr-1.5" size={16} />
                  Afficher la recherche
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Barre de recherche - conditionnellement affichée */}
        {showSearchBar && (
          <div id="search-container">
            <ProductSearch onSearch={onSearch} />
          </div>
        )}
        
        {/* Navigation par sections - apparaît seulement quand il y a des résultats */}
        {showNavigation && (
          <div className={showSearchBar ? "mt-2" : ""}>
            <ProductSectionNav activeSection={activeSection} />
          </div>
        )}
      </div>
    </div>
  );
}