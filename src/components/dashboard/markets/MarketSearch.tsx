// src/components/markets/MarketSearch.tsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { MarketSegment, searchMockSegments, formatCurrency } from '@/utils/marketSegmentData';

interface MarketSearchProps {
  onSearch: (segments: MarketSegment[]) => void;
  selectedType: string;
}

export const MarketSearch: React.FC<MarketSearchProps> = ({ onSearch, selectedType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedSegments, setSuggestedSegments] = useState<MarketSegment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<MarketSegment[]>([]);

  // Recherche dynamique
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchMockSegments(searchTerm, selectedType);
      // Exclure les segments déjà sélectionnés
      const filteredResults = results.filter(
        segment => !selectedSegments.some(selected => selected.id === segment.id)
      );
      setSuggestedSegments(filteredResults);
    } else {
      setSuggestedSegments([]);
    }
  }, [searchTerm, selectedSegments, selectedType]);

  // Ajouter un segment à la sélection
  const addSegment = (segment: MarketSegment) => {
    if (!selectedSegments.some(selected => selected.id === segment.id)) {
      setSelectedSegments([...selectedSegments, segment]);
      setSearchTerm('');
      setSuggestedSegments([]);
    }
  };

  // Retirer un segment de la sélection
  const removeSegment = (segmentToRemove: MarketSegment) => {
    setSelectedSegments(selectedSegments.filter(segment => segment.id !== segmentToRemove.id));
  };

  // Soumettre la recherche
  const handleSearchSubmit = () => {
    if (selectedSegments.length > 0) {
      onSearch(selectedSegments);
    } else {
      const results = searchMockSegments(searchTerm, selectedType);
      onSearch(results);
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestedSegments([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recherche de segments de marché
        </h3>
        
        {/* Segments sélectionnés */}
        {selectedSegments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedSegments.map((segment) => (
              <div 
                key={segment.id} 
                className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded-full text-sm"
              >
                {segment.name}
                <button 
                  onClick={() => removeSegment(segment)}
                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Barre de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Rechercher un ${selectedType === 'universe' ? 'univers' : 'segment'}`}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}

          {/* Suggestions */}
          {searchTerm.trim() && suggestedSegments.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <div className="max-h-64 overflow-y-auto">
                {suggestedSegments.map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => addSegment(segment)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{segment.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {segment.products} produits
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      CA: {formatCurrency(segment.revenue)} | Croissance: {segment.growth}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Bouton de recherche */}
        <button
          onClick={handleSearchSubmit}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiSearch className="mr-2" size={16} />
          {selectedSegments.length > 0 
            ? `Rechercher (${selectedSegments.length} segment${selectedSegments.length > 1 ? 's' : ''})` 
            : 'Rechercher'
          }
        </button>
      </div>
    </div>
  );
};