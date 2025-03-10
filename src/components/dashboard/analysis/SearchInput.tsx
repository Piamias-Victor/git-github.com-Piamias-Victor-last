import React from 'react';
import { FiCode, FiSearch, FiX } from 'react-icons/fi';

interface SearchInputProps {
  searchTerm: string;
  searchType: 'name' | 'code' | 'suffix' | 'list';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

/**
 * Composant d'entrée de recherche simple
 */
export function SearchInput({ searchTerm, searchType, onChange, onClear }: SearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {searchType === 'suffix' || searchType === 'code' ? (
          <FiCode className="h-5 w-5 text-gray-400" />
        ) : (
          <FiSearch className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={onChange}
        className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={
          searchType === 'suffix' 
            ? "Recherche par fin de code (*1234)" 
            : searchType === 'code' 
              ? "Recherche par code EAN13" 
              : "Recherche par nom de produit"
        }
      />
      {searchTerm && (
        <button 
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          onClick={onClear}
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}