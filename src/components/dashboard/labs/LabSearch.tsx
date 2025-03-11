// src/components/dashboard/labs/LabSearch.tsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface LabSearchProps {
  onSearch: (results: any[]) => void;
}

export function LabSearch({ onSearch }: LabSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedLabs, setSuggestedLabs] = useState<any[]>([]);
  const [selectedLabs, setSelectedLabs] = useState<any[]>([]);

  // Effectuer la recherche dynamique à chaque changement de texte
  useEffect(() => {
    // Filtrer les laboratoires dès que le terme de recherche change
    if (searchTerm.trim()) {
      const results = generateMockLabResults(searchTerm);
      // Exclure les laboratoires déjà sélectionnés
      const filteredResults = results.filter(
        lab => !selectedLabs.some(selectedLab => selectedLab.id === lab.id)
      );
      setSuggestedLabs(filteredResults);
    } else {
      setSuggestedLabs([]);
    }
  }, [searchTerm, selectedLabs]);

  // Fonction pour ajouter un laboratoire à la sélection
  const addLaboratory = (lab: any) => {
    // Vérifier si le laboratoire n'est pas déjà sélectionné
    if (!selectedLabs.some(selectedLab => selectedLab.id === lab.id)) {
      setSelectedLabs([...selectedLabs, lab]);
      setSearchTerm(''); // Réinitialiser le champ de recherche
      setSuggestedLabs([]); // Cacher les suggestions
    }
  };

  // Fonction pour retirer un laboratoire de la sélection
  const removeLaboratory = (labToRemove: any) => {
    setSelectedLabs(selectedLabs.filter(lab => lab.id !== labToRemove.id));
  };

  // Fonction pour soumettre la recherche
  const handleSearchSubmit = () => {
    if (selectedLabs.length > 0) {
      // Soumettre les laboratoires sélectionnés
      onSearch(selectedLabs);
    } else {
      // Soumettre tous les résultats correspondants
      const results = generateMockLabResults(searchTerm);
      onSearch(results);
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestedLabs([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 relative">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recherche de laboratoires
          </h3>
        </div>
        
        {/* Laboratoires sélectionnés */}
        {selectedLabs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedLabs.map((lab) => (
              <div 
                key={lab.id} 
                className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded-full text-sm"
              >
                {lab.name}
                <button 
                  onClick={() => removeLaboratory(lab)}
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
            placeholder="Rechercher un laboratoire (ex: Sanofi, Pfizer, etc.)"
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
          {searchTerm.trim() && suggestedLabs.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <div className="max-h-64 overflow-y-auto">
                {suggestedLabs.map((lab) => (
                  <button
                    key={lab.id}
                    onClick={() => addLaboratory(lab)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{lab.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {lab.products} produits
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      CA: {(lab.revenue.sellOut / 1000000).toFixed(1)}M€ | Croissance: {lab.growth}
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
          {selectedLabs.length > 0 
            ? `Rechercher (${selectedLabs.length} laboratoire${selectedLabs.length > 1 ? 's' : ''})` 
            : 'Rechercher'
          }
        </button>
      </div>
    </div>
  );
}

/**
 * Génère des résultats de recherche simulés pour les laboratoires
 */
function generateMockLabResults(searchTerm: string): any[] {
  // Liste des laboratoires à filtrer
  const allLabs = [
    { 
      id: 'lab1', 
      name: 'Sanofi', 
      products: 142, 
      revenue: { 
        sellOut: 1850000, 
        sellIn: 2100000 
      }, 
      growth: '+5.2%', 
      margin: '29.8%' 
    },
    { 
      id: 'lab2', 
      name: 'Pfizer', 
      products: 128, 
      revenue: { 
        sellOut: 1620000, 
        sellIn: 1850000 
      }, 
      growth: '+7.4%', 
      margin: '28.5%' 
    },
    { 
      id: 'lab3', 
      name: 'Novartis', 
      products: 115, 
      revenue: { 
        sellOut: 1485000, 
        sellIn: 1700000 
      }, 
      growth: '+3.8%', 
      margin: '30.2%' 
    },
    { 
      id: 'lab4', 
      name: 'Bayer', 
      products: 96, 
      revenue: { 
        sellOut: 1320000, 
        sellIn: 1500000 
      }, 
      growth: '+2.1%', 
      margin: '26.7%' 
    },
    { 
      id: 'lab5', 
      name: 'Roche', 
      products: 88, 
      revenue: { 
        sellOut: 1275000, 
        sellIn: 1450000 
      }, 
      growth: '+4.5%', 
      margin: '31.4%' 
    },
    { 
      id: 'lab6', 
      name: 'GSK', 
      products: 76, 
      revenue: { 
        sellOut: 1145000, 
        sellIn: 1300000 
      }, 
      growth: '+1.8%', 
      margin: '27.3%' 
    },
    { 
      id: 'lab7', 
      name: 'Johnson & Johnson', 
      products: 104, 
      revenue: { 
        sellOut: 1390000, 
        sellIn: 1580000 
      }, 
      growth: '+6.2%', 
      margin: '32.1%' 
    },
    { 
      id: 'lab8', 
      name: 'AstraZeneca', 
      products: 92, 
      revenue: { 
        sellOut: 1180000, 
        sellIn: 1350000 
      }, 
      growth: '+8.5%', 
      margin: '30.8%' 
    },
    { 
      id: 'lab9', 
      name: 'Merck', 
      products: 85, 
      revenue: { 
        sellOut: 1250000, 
        sellIn: 1420000 
      }, 
      growth: '+4.9%', 
      margin: '29.5%' 
    },
    { 
      id: 'lab10', 
      name: 'Eli Lilly', 
      products: 68, 
      revenue: { 
        sellOut: 985000, 
        sellIn: 1120000 
      }, 
      growth: '+5.7%', 
      margin: '28.9%' 
    },
    { 
      id: 'lab11', 
      name: 'Bristol-Myers Squibb', 
      products: 72, 
      revenue: { 
        sellOut: 1050000, 
        sellIn: 1200000 
      }, 
      growth: '+3.2%', 
      margin: '27.6%' 
    },
    { 
      id: 'lab12', 
      name: 'Biogaran', 
      products: 156, 
      revenue: { 
        sellOut: 1420000, 
        sellIn: 1620000 
      }, 
      growth: '+6.8%', 
      margin: '24.3%' 
    },
    { 
      id: 'lab13', 
      name: 'Mylan', 
      products: 102, 
      revenue: { 
        sellOut: 950000, 
        sellIn: 1080000 
      }, 
      growth: '+1.5%', 
      margin: '23.8%' 
    },
    { 
      id: 'lab14', 
      name: 'Teva', 
      products: 118, 
      revenue: { 
        sellOut: 1080000, 
        sellIn: 1230000 
      }, 
      growth: '-0.8%', 
      margin: '22.5%' 
    },
    { 
      id: 'lab15', 
      name: 'Servier', 
      products: 89, 
      revenue: { 
        sellOut: 920000, 
        sellIn: 1050000 
      }, 
      growth: '+2.7%', 
      margin: '26.2%' 
    }
  ];
  
  // Filtrer les laboratoires selon le terme de recherche
  if (!searchTerm.trim()) {
    return allLabs; // Retourne tous les laboratoires si pas de recherche
  }
  
  const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
  return allLabs.filter(lab => 
    lab.name.toLowerCase().includes(lowercaseSearchTerm)
  );
}