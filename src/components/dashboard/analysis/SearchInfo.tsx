import React from 'react';

interface SearchInfoProps {
  searchType: 'name' | 'code' | 'suffix' | 'list';
}

/**
 * Composant d'affichage du type de recherche actuel
 */
export function SearchInfo({ searchType }: SearchInfoProps) {
  const getSearchTypeLabel = () => {
    switch (searchType) {
      case 'name': 
        return 'Nom de produit';
      case 'code': 
        return 'Code EAN13';
      case 'suffix': 
        return 'Fin de code EAN13';
      case 'list': 
        return 'Liste de codes';
      default:
        return 'Recherche';
    }
  };

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
        Mode de recherche actuel:
      </span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
        {getSearchTypeLabel()}
      </span>
    </div>
  );
}