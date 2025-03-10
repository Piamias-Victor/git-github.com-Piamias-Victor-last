import React from 'react';
import { FiList, FiSearch } from 'react-icons/fi';

interface SearchHeaderProps {
  isListMode: boolean;
  toggleListMode: () => void;
}

/**
 * En-tête du composant de recherche avec le toggle entre modes
 */
export function SearchHeader({ isListMode, toggleListMode }: SearchHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recherche de produits
      </h3>
      <button
        onClick={toggleListMode}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        {isListMode ? (
          <>
            <FiSearch className="mr-1" size={16} />
            Mode recherche simple
          </>
        ) : (
          <>
            <FiList className="mr-1" size={16} />
            Mode liste de codes
          </>
        )}
      </button>
    </div>
  );
}