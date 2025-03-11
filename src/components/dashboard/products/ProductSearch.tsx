import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import { detectSearchType, generateMockResults } from '@/utils/searchUtils';
import { CodeListInput } from '../analysis/CodeListInput';
import { SearchHeader } from '../analysis/SearchHeader';
import { SearchInfo } from '../analysis/SearchInfo';
import { SearchInput } from '../analysis/SearchInput';

interface ProductSearchProps {
  onSearch: (results: any[]) => void;
}

/**
 * Composant principal de recherche de produits
 * Coordonne les différents sous-composants
 */
export function ProductSearch({ onSearch }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'code' | 'suffix' | 'list'>('name');
  const [isListMode, setIsListMode] = useState(false);
  
  // Fonction pour traiter la recherche
  const handleSearch = () => {
    // Générer des résultats simulés (dans une app réelle, ce serait un appel API)
    const results = generateMockResults(searchTerm, searchType);
    onSearch(results);
  };
  
  // Gestion des changements d'entrée
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchType(detectSearchType(value, isListMode));
  };
  
  // Basculer entre mode simple et mode liste
  const toggleListMode = () => {
    setIsListMode(!isListMode);
    setSearchType(isListMode ? 'name' : 'list');
    setSearchTerm('');
  };

  // Effacer le champ de recherche
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col space-y-4">
        <SearchHeader 
          isListMode={isListMode} 
          toggleListMode={toggleListMode} 
        />
        
        <div className="mt-2">
          {!isListMode ? (
            <SearchInput 
              searchTerm={searchTerm}
              searchType={searchType}
              onChange={handleInputChange}
              onClear={clearSearch}
            />
          ) : (
            <CodeListInput 
              value={searchTerm}
              onChange={handleInputChange}
            />
          )}
        </div>
        
        <SearchInfo searchType={searchType} />
        
        <button
          onClick={handleSearch}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiSearch className="mr-2" size={16} />
          Rechercher
        </button>
      </div>
    </div>
  );
}