// src/components/dashboard/products/ProductSearch.tsx
import React, { useState } from 'react';
import { mockProductData } from '@/utils/mockProductData';
import { FiSearch, FiCode, FiX } from 'react-icons/fi';

interface ProductSearchProps {
  onSearch: (results: any[]) => void;
}

export function ProductSearch({ onSearch }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListMode, setIsListMode] = useState(false);
  const [searchType, setSearchType] = useState<'name' | 'code' | 'suffix' | 'list'>('name');

  // Déterminer le type de recherche à partir de la valeur
  const detectSearchType = (value: string): 'name' | 'code' | 'suffix' | 'list' => {
    if (isListMode) {
      return 'list';
    } else if (value.startsWith('*')) {
      return 'suffix';
    } else if (/^\d+$/.test(value)) {
      return 'code';
    } else {
      return 'name';
    }
  };

  // Gérer le changement dans le champ de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Mettre à jour le type de recherche en fonction de la valeur
    if (!isListMode) {
      setSearchType(detectSearchType(value));
    }
  };

  // Soumettre la recherche
  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      // Dans une vraie application, nous ferions un appel API ici
      // Pour la démonstration, nous filtrons simplement les données fictives
      const results = mockProductData.filter(product => {
        if (searchType === 'name') {
          return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'code') {
          return product.ean.includes(searchTerm);
        } else if (searchType === 'suffix') {
          const suffix = searchTerm.replace(/^\*+/, '');
          return product.ean.endsWith(suffix);
        } else {
          // Recherche par liste - diviser la chaîne et chercher chaque code
          const codes = searchTerm.split(/[\n,;]/).map(code => code.trim()).filter(Boolean);
          return codes.some(code => product.ean.includes(code));
        }
      });
      
      onSearch(results);
    } else {
      // Si le champ est vide, retourner tous les résultats
      onSearch(mockProductData);
    }
  };

  // Basculer entre le mode de recherche simple et le mode liste
  const toggleListMode = () => {
    setIsListMode(!isListMode);
    setSearchType(isListMode ? 'name' : 'list');
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
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
              <FiCode className="mr-1" size={16} />
              Mode liste de codes
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-4">
        {isListMode ? (
          // Mode liste de codes
          <textarea
            value={searchTerm}
            onChange={handleSearchChange}
            rows={5}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Collez une liste de codes EAN (séparés par des sauts de ligne, virgules ou points-virgules)"
          />
        ) : (
          // Mode recherche simple
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
              onChange={handleSearchChange}
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
                onClick={clearSearch}
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        <button
          onClick={handleSearchSubmit}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiSearch className="mr-2" size={16} />
          Rechercher
        </button>
      </div>
    </div>
  );
}