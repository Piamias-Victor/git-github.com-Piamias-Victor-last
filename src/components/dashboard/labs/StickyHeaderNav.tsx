// src/components/dashboard/labs/StickyHeaderNav.tsx
import React, { useState } from 'react';
import { LabSearch } from '@/components/dashboard/labs/LabSearch';
import { LabSectionNav } from '@/components/dashboard/labs/LabSectionNav';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';
import { FiSearch, FiX } from 'react-icons/fi';

interface StickyHeaderNavProps {
  onSearch: (labs: Laboratory[]) => void;
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
            {showNavigation ? 'Navigation par section' : 'Recherche de laboratoires'}
          </h3>
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
        
        {/* Barre de recherche - conditionnellement affichée */}
        {showSearchBar && (
          <div id="search-container">
            <LabSearch onSearch={onSearch} />
          </div>
        )}
        
        {/* Navigation par sections - apparaît seulement quand il y a des résultats */}
        {showNavigation && (
          <div className={showSearchBar ? "mt-2" : ""}>
            <LabSectionNav activeSection={activeSection} />
          </div>
        )}
      </div>
    </div>
  );
}