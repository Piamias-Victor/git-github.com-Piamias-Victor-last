// src/components/dashboard/labs/StickyHeaderNav.tsx
import React from 'react';
import { LabSearch } from '@/components/dashboard/labs/LabSearch';
import { LabSectionNav } from '@/components/dashboard/labs/LabSectionNav';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';

interface StickyHeaderNavProps {
  onSearch: (labs: Laboratory[]) => void;
  showNavigation: boolean;
  activeSection: string;
}

/**
 * Composant pour afficher une barre de recherche et la navigation qui reste fixe
 * au haut de l'écran pendant le défilement
 */
export function StickyHeaderNav({ 
  onSearch, 
  showNavigation,
  activeSection
}: StickyHeaderNavProps) {
  return (
    <div className="sticky rounded-xl top-0 z-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="space-y-4">
        {/* Barre de recherche */}
        <div id="search-container">
          <LabSearch onSearch={onSearch} />
        </div>
        
        {/* Navigation par sections - apparaît seulement quand il y a des résultats */}
        {showNavigation && (
          <div className="mt-2">
            <LabSectionNav activeSection={activeSection} />
          </div>
        )}
      </div>
    </div>
  );
}