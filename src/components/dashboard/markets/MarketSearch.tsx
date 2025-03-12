// src/components/dashboard/markets/MarketSearch.tsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

interface MarketSearchProps {
  onSearch: (segments: MarketSegment[]) => void;
  selectedType?: string;
}

export function MarketSearch({ onSearch, selectedType = 'universe' }: MarketSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedSegments, setSuggestedSegments] = useState<MarketSegment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<MarketSegment[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Effectuer la recherche dynamique à chaque changement de texte
  useEffect(() => {
    // Filtrer les segments dès que le terme de recherche change
    if (searchTerm.trim()) {
      const results = generateMockSegments(searchTerm, selectedType);
      // Exclure les segments déjà sélectionnés
      const filteredResults = results.filter(
        segment => !selectedSegments.some(selected => selected.id === segment.id)
      );
      setSuggestedSegments(filteredResults);
    } else {
      setSuggestedSegments([]);
    }
  }, [searchTerm, selectedSegments, selectedType]);

  // Fonction pour ajouter un segment à la sélection
  const addSegment = (segment: MarketSegment) => {
    if (!selectedSegments.some(selected => selected.id === segment.id)) {
      setSelectedSegments([...selectedSegments, segment]);
      setSearchTerm(''); // Réinitialiser le champ de recherche
      setSuggestedSegments([]); // Cacher les suggestions
    }
  };

  // Fonction pour retirer un segment de la sélection
  const removeSegment = (segmentToRemove: MarketSegment) => {
    setSelectedSegments(selectedSegments.filter(segment => segment.id !== segmentToRemove.id));
  };

  // Fonction pour soumettre la recherche
  const handleSearchSubmit = () => {
    if (selectedSegments.length > 0) {
      // Soumettre les segments sélectionnés
      onSearch(selectedSegments);
    } else {
      // Soumettre tous les résultats correspondants
      const results = generateMockSegments(searchTerm, selectedType);
      onSearch(results);
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestedSegments([]);
  };

  // Toggle du panel de filtres
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 relative">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recherche de segments de marché
          </h3>
          <button
            onClick={toggleFilters}
            className="inline-flex items-center text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <FiFilter className="mr-2" size={16} />
            Filtres
          </button>
        </div>
        
        {/* Panel de filtres - conditionnellement affiché */}
        {isFilterOpen && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de segment
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <SegmentTypeButton 
                type="universe" 
                label="Univers" 
                isSelected={selectedType === 'universe'} 
              />
              <SegmentTypeButton 
                type="category" 
                label="Catégories" 
                isSelected={selectedType === 'category'} 
              />
              <SegmentTypeButton 
                type="sub_category" 
                label="Sous-catégories" 
                isSelected={selectedType === 'sub_category'} 
              />
              <SegmentTypeButton 
                type="family" 
                label="Familles" 
                isSelected={selectedType === 'family'} 
              />
              <SegmentTypeButton 
                type="sub_family" 
                label="Sous-familles" 
                isSelected={selectedType === 'sub_family'} 
              />
              <SegmentTypeButton 
                type="specificity" 
                label="Spécificités" 
                isSelected={selectedType === 'specificity'} 
              />
              <SegmentTypeButton 
                type="lab_distributor" 
                label="Distributeurs" 
                isSelected={selectedType === 'lab_distributor'} 
              />
              <SegmentTypeButton 
                type="brand_lab" 
                label="Marques" 
                isSelected={selectedType === 'brand_lab'} 
              />
              <SegmentTypeButton 
                type="range_name" 
                label="Gammes" 
                isSelected={selectedType === 'range_name'} 
              />
            </div>
          </div>
        )}
        
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
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Rechercher un ${selectedType === 'universe' ? 'univers' : selectedType === 'category' ? 'catégorie' : selectedType === 'family' ? 'famille' : 'segment'}`}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}

          {/* Liste de suggestions dynamiques */}
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
        
        {/* Bouton de recherche principal */}
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
}

// Bouton pour la sélection du type de segment
interface SegmentTypeButtonProps {
  type: string;
  label: string;
  isSelected?: boolean;
}

function SegmentTypeButton({ type, label, isSelected = false }: SegmentTypeButtonProps) {
  return (
    <button
      className={`px-3 py-2 text-sm rounded-md ${
        isSelected
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
      }`}
    >
      {label}
    </button>
  );
}

// Format monétaire
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

// Fonction pour générer des données de marché simulées
function generateMockSegments(searchTerm: string, type: string): MarketSegment[] {
  const mockData: Record<string, MarketSegment[]> = {
    universe: [
      {
        id: 'univ1',
        name: 'Médicaments',
        type: 'universe',
        products: 245,
        revenue: 1250000,
        growth: '+5.2%',
        marketShare: '42.5%',
        dominantLab: 'Sanofi'
      },
      {
        id: 'univ2',
        name: 'Parapharmacie',
        type: 'universe',
        products: 180,
        revenue: 880000,
        growth: '+7.8%',
        marketShare: '30.0%',
        dominantLab: 'L\'Oréal'
      },
      {
        id: 'univ3',
        name: 'Hygiène & Soins',
        type: 'universe',
        products: 135,
        revenue: 560000,
        growth: '+3.4%',
        marketShare: '19.1%',
        dominantLab: 'Johnson & Johnson'
      },
      {
        id: 'univ4',
        name: 'Nutrition',
        type: 'universe',
        products: 85,
        revenue: 245000,
        growth: '+4.1%',
        marketShare: '8.4%',
        dominantLab: 'Nutricia'
      }
    ],
    category: [
      {
        id: 'cat1',
        name: 'Douleur & Fièvre',
        type: 'category',
        parent: 'Médicaments',
        products: 68,
        revenue: 420000,
        growth: '+4.5%',
        marketShare: '33.6%',
        dominantLab: 'Sanofi'
      },
      {
        id: 'cat2',
        name: 'Antibiotiques',
        type: 'category',
        parent: 'Médicaments',
        products: 42,
        revenue: 290000,
        growth: '+1.8%',
        marketShare: '23.2%',
        dominantLab: 'Pfizer'
      },
      {
        id: 'cat3',
        name: 'Système Digestif',
        type: 'category',
        parent: 'Médicaments',
        products: 35,
        revenue: 180000,
        growth: '+3.6%',
        marketShare: '14.4%',
        dominantLab: 'Sanofi'
      },
      {
        id: 'cat4',
        name: 'Soins du Visage',
        type: 'category',
        parent: 'Parapharmacie',
        products: 56,
        revenue: 320000,
        growth: '+9.2%',
        marketShare: '36.4%',
        dominantLab: 'L\'Oréal'
      },
      {
        id: 'cat5',
        name: 'Soins du Corps',
        type: 'category',
        parent: 'Parapharmacie',
        products: 48,
        revenue: 275000,
        growth: '+7.5%',
        marketShare: '31.3%',
        dominantLab: 'Vichy'
      }
    ],
    sub_category: [
      {
        id: 'subcat1',
        name: 'Antipyrétiques',
        type: 'sub_category',
        parent: 'Douleur & Fièvre',
        products: 24,
        revenue: 185000,
        growth: '+3.8%',
        marketShare: '44.0%',
        dominantLab: 'Sanofi'
      },
      {
        id: 'subcat2',
        name: 'Analgésiques',
        type: 'sub_category',
        parent: 'Douleur & Fièvre',
        products: 32,
        revenue: 215000,
        growth: '+5.1%',
        marketShare: '51.2%',
        dominantLab: 'UPSA'
      },
      {
        id: 'subcat3',
        name: 'Pénicillines',
        type: 'sub_category',
        parent: 'Antibiotiques',
        products: 18,
        revenue: 145000,
        growth: '+0.9%',
        marketShare: '50.0%',
        dominantLab: 'Pfizer'
      }
    ],
    family: [
      {
        id: 'fam1',
        name: 'Antalgiques',
        type: 'family',
        products: 45,
        revenue: 320000,
        growth: '+4.8%',
        marketShare: '25.6%',
        dominantLab: 'Sanofi'
      },
      {
        id: 'fam2',
        name: 'Anti-inflammatoires',
        type: 'family',
        products: 32,
        revenue: 245000,
        growth: '+3.2%',
        marketShare: '19.6%',
        dominantLab: 'Pfizer'
      }
    ],
    lab_distributor: [
      {
        id: 'dist1',
        name: 'CERP',
        type: 'lab_distributor',
        products: 125,
        revenue: 685000,
        growth: '+2.5%',
        marketShare: '28.7%',
        dominantLab: 'N/A'
      },
      {
        id: 'dist2',
        name: 'Alliance Healthcare',
        type: 'lab_distributor',
        products: 110,
        revenue: 580000,
        growth: '+3.8%',
        marketShare: '24.3%',
        dominantLab: 'N/A'
      }
    ],
    brand_lab: [
      {
        id: 'brand1',
        name: 'Sanofi',
        type: 'brand_lab',
        products: 85,
        revenue: 485000,
        growth: '+4.2%',
        marketShare: '16.5%',
        dominantLab: 'N/A'
      },
      {
        id: 'brand2',
        name: 'Pfizer',
        type: 'brand_lab',
        products: 64,
        revenue: 425000,
        growth: '+3.6%',
        marketShare: '14.5%',
        dominantLab: 'N/A'
      }
    ],
    range_name: [
      {
        id: 'range1',
        name: 'Doliprane',
        type: 'range_name',
        products: 12,
        revenue: 185000,
        growth: '+3.5%',
        marketShare: '6.3%',
        dominantLab: 'Sanofi'
      },
      {
        id: 'range2',
        name: 'Efferalgan',
        type: 'range_name',
        products: 8,
        revenue: 125000,
        growth: '+2.8%',
        marketShare: '4.3%',
        dominantLab: 'UPSA'
      }
    ]
  };

  // Si pas de terme de recherche, retourner tous les segments du type choisi
  if (!searchTerm.trim()) {
    return mockData[type] || [];
  }
  
  // Sinon, filtrer les segments qui correspondent au terme de recherche
  const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
  return (mockData[type] || []).filter(segment => 
    segment.name.toLowerCase().includes(lowercaseSearchTerm)
  );
}