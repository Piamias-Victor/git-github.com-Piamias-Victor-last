// src/components/dashboard/markets/MarketStickyNav.tsx
import React, { useState } from 'react';
import { MarketSearch } from './MarketSearch';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { MarketSectionNav } from './MarketSectionNav';

interface MarketStickyNavProps {
  onSearch: (segments: MarketSegment[]) => void;
  showNavigation: boolean;
  activeSection: string;
  segmentType: 'universe' | 'category' | 'sub_category' | 'family' | 'sub_family' | 'specificity' | 'lab_distributor' | 'brand_lab' | 'range_name';
  onSegmentTypeChange: (type: string) => void;
}

/**
 * Composant pour afficher une barre de recherche et la navigation qui reste fixe
 * au haut de l'écran pendant le défilement
 */
export function MarketStickyNav({ 
  onSearch, 
  showNavigation,
  activeSection,
  segmentType,
  onSegmentTypeChange
}: MarketStickyNavProps) {
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
  
  // Fonction pour changer le type de segment
  const handleTypeChange = (type: string) => {
    onSegmentTypeChange(type);
    setShowTypeSelector(false);
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
      case 'brand_lab': return 'Marques/Laboratoires';
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
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Sélectionner le type de segment à analyser
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              <SegmentTypeButton 
                type="universe" 
                label="Univers" 
                isSelected={segmentType === 'universe'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="category" 
                label="Catégories" 
                isSelected={segmentType === 'category'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="sub_category" 
                label="Sous-catégories" 
                isSelected={segmentType === 'sub_category'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="family" 
                label="Familles" 
                isSelected={segmentType === 'family'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="sub_family" 
                label="Sous-familles" 
                isSelected={segmentType === 'sub_family'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="specificity" 
                label="Spécificités" 
                isSelected={segmentType === 'specificity'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="lab_distributor" 
                label="Distributeurs" 
                isSelected={segmentType === 'lab_distributor'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="brand_lab" 
                label="Marques" 
                isSelected={segmentType === 'brand_lab'} 
                onClick={handleTypeChange}
              />
              <SegmentTypeButton 
                type="range_name" 
                label="Gammes" 
                isSelected={segmentType === 'range_name'} 
                onClick={handleTypeChange}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Le choix du type de segment modifie l'approche d'analyse et la granularité des données.
            </p>
          </div>
        )}
        
        {/* Barre de recherche - conditionnellement affichée */}
        {showSearchBar && (
          <div id="search-container">
            <MarketSearch onSearch={onSearch} selectedType={segmentType} />
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
}

// Bouton pour la sélection du type de segment
interface SegmentTypeButtonProps {
  type: string;
  label: string;
  isSelected?: boolean;
  onClick: (type: string) => void;
}

function SegmentTypeButton({ type, label, isSelected = false, onClick }: SegmentTypeButtonProps) {
  return (
    <button
      onClick={() => onClick(type)}
      className={`px-3 py-2 text-sm rounded-md transition-colors ${
        isSelected
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
      }`}
    >
      {label}
    </button>
  );
}