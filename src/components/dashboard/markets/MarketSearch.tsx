import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiTag } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

interface MarketSearchProps {
  onSearch: (segments: MarketSegment[]) => void;
  selectedType: string;
  searchAllSegments: (searchTerm: string) => MarketSegment[];
}

export const MarketSearch: React.FC<MarketSearchProps> = ({ 
  onSearch, 
  selectedType, 
  searchAllSegments 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedSegments, setSuggestedSegments] = useState<MarketSegment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<MarketSegment[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Fonction de recherche avec debounce
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsTyping(true);
      const debounceTimer = setTimeout(() => {
        const results = searchAllSegments(searchTerm);
        // Exclure les segments déjà sélectionnés
        const filteredResults = results.filter(
          segment => !selectedSegments.some(selected => selected.id === segment.id)
        );
        setSuggestedSegments(filteredResults.slice(0, 10)); // Limiter à 10 résultats pour performance
        setIsTyping(false);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestedSegments([]);
      setIsTyping(false);
    }
  }, [searchTerm, selectedSegments, searchAllSegments]);

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
    } else if (searchTerm.trim()) {
      const results = searchAllSegments(searchTerm);
      onSearch(results.length > 0 ? results : []);
    } else {
      // Recherche vide, afficher tous les segments du type sélectionné
      onSearch([]);
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestedSegments([]);
  };

  // Obtenir la couleur de badge selon le type de segment
  const getSegmentTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'universe':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'category':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'sub_category':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'family':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'sub_family':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'specificity':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Obtenir le label du type de segment
  const getSegmentTypeLabel = (type: string): string => {
    switch (type) {
      case 'universe': return 'Univers';
      case 'category': return 'Catégorie';
      case 'sub_category': return 'Sous-catégorie';
      case 'family': return 'Famille';
      case 'sub_family': return 'Sous-famille';
      case 'specificity': return 'Spécificité';
      case 'lab_distributor': return 'Distributeur';
      case 'brand_lab': return 'Laboratoire';
      case 'range_name': return 'Gamme';
      default: return 'Segment';
    }
  };

  // Formater les valeurs monétaires
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recherche de segments de marché
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Recherchez par univers, catégorie, famille ou spécificité. Vous pouvez sélectionner plusieurs segments pour analyse comparative.
        </p>
        
        {/* Segments sélectionnés */}
        {selectedSegments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedSegments.map((segment) => (
              <div 
                key={segment.id} 
                className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded-full text-sm"
              >
                <span className="mr-1 text-xs">
                  {getSegmentTypeLabel(segment.type)}:
                </span>
                {segment.name}
                <button 
                  onClick={() => removeSegment(segment)}
                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
            {selectedSegments.length > 0 && (
              <button
                onClick={() => setSelectedSegments([])}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                Tout effacer
              </button>
            )}
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
            placeholder="Rechercher un segment de marché (univers, catégorie, famille...)"
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}

          {/* Indicateur de chargement */}
          {isTyping && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50">
              <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Recherche en cours...
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!isTyping && searchTerm.trim() && suggestedSegments.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="max-h-64 overflow-y-auto">
                {suggestedSegments.map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => addSegment(segment)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${getSegmentTypeBadgeColor(segment.type)}`}>
                          {getSegmentTypeLabel(segment.type)}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{segment.name}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="mr-2">{segment.products} produits</span>
                        <span>CA: {formatCurrency(segment.revenue)}</span>
                        <span className={`ml-2 ${segment.growth.startsWith('-') 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'}`}
                        >
                          {segment.growth}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 pl-2">
                      <FiTag size={16} className="text-indigo-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Message quand aucun résultat */}
          {!isTyping && searchTerm.trim() && suggestedSegments.length === 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Aucun segment trouvé pour "{searchTerm}"
              </p>
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
            ? `Analyser ${selectedSegments.length} segment${selectedSegments.length > 1 ? 's' : ''}` 
            : searchTerm.trim() 
              ? 'Rechercher' 
              : 'Voir tous les segments'
          }
        </button>
      </div>
    </div>
  );
};