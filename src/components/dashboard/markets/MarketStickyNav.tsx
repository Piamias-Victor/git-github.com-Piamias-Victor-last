// src/components/markets/MarketStickyNav.tsx
import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { MarketSearch } from './MarketSearch';
import { MarketSectionNav } from './MarketSectionNav';
import { SegmentTypeSelector } from './SegmentTypeSelector';
import { MarketSegment } from '@/utils/marketSegmentData';

interface MarketStickyNavProps {
  onSearch: (segments: MarketSegment[]) => void;
  showNavigation: boolean;
  activeSection: string;
  segmentType: string;
  onSegmentTypeChange: (type: string) => void;
}

export const MarketStickyNav: React.FC<MarketStickyNavProps> = ({
  onSearch,
  showNavigation,
  activeSection,
  segmentType,
  onSegmentTypeChange
}) => {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Fonction pour basculer l'affichage de la barre de recherche
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  // Fonction pour basculer l'affichage du sélecteur de type
  const toggleTypeSelector = () => {
    setShowTypeSelector(!showTypeSelector);
  };

  // Formatage du nom du type de segment pour l'affichage
  const getSegmentTypeLabel = () => {
    switch (segmentType) {
      case 'universe': return 'Univers';
      case 'category': return 'Catégories';
      case 'sub_category': return 'Sous-catégories';
      case 'family': return 'Familles';
      case 'sub_family': return 'Sous-familles';
      case 'specificity': return 'Spécificités';
      case 'lab_distributor': return 'Distributeurs';
      case 'brand_lab': return 'Laboratoires';
      case 'range_name': return 'Gammes';
      default: return 'Segments';
    }
  };

  return (
    <div className="sticky rounded-xl top-0 z-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="space-y-4 p-4">
        {/* En-tête avec les contrôles */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {showNavigation ? 'Navigation par section' : 'Recherche de segments'}
            </h3>
            <button
              onClick={toggleTypeSelector}
              className="ml-3 inline-flex items-center px-3 py-1 text-sm rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
            >
              {getSegmentTypeLabel()} <FiFilter className="ml-1.5" size={14} />
            </button>
          </div>
          <button
            onClick={toggleSearchBar}
            className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
        
        {/* Sélecteur de type de segment - conditionnellement affiché */}
        {showTypeSelector && (
          <SegmentTypeSelector 
            selectedType={segmentType} 
            onTypeChange={(type) => {
              onSegmentTypeChange(type);
              setShowTypeSelector(false);
            }} 
          />
        )}
        
        {/* Barre de recherche - conditionnellement affichée */}
        {showSearchBar && (
          <div id="search-container">
            <MarketSearch 
              onSearch={onSearch} 
              selectedType={segmentType} 
            />
          </div>
        )}
        
        {/* Navigation par sections - apparaît seulement quand il y a des résultats */}
        {showNavigation && (
          <div className={showSearchBar ? "mt-2" : ""}>
            <MarketSectionNav activeSection={activeSection} />
          </div>
        )}
      </div>
    </div>
  );
};