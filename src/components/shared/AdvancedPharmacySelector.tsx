import React, { useState, useRef, useEffect } from 'react';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiSearch, 
  FiX, 
  FiMap, 
  FiDollarSign, 
  FiMaximize,
  FiCheckCircle,
  FiUsers,
  FiInfo,
  FiFilter,
  FiCheck
} from 'react-icons/fi';
import { usePharmacySelection } from '@/providers/PharmacyProvider';

// Interface pour les données de pharmacie
interface Pharmacy {
  id: string;
  name: string;
  region: string;
  revenue: string; // Tranche de CA
  size: string;   // Superficie
}

// Regroupements possibles
type GroupingType = 'none' | 'region' | 'revenue' | 'size';

interface AdvancedPharmacySelectorProps {
  selectedPharmacies: string[];
  onPharmacyChange: (pharmacyIds: string[]) => void;
}

export function AdvancedPharmacySelector({ selectedPharmacies, onPharmacyChange }: AdvancedPharmacySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pharmacies' | 'filters'>('pharmacies');
  const [groupBy, setGroupBy] = useState<GroupingType>('none');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lastFilterType, selectedFilter, setLastFilterType, setSelectedFilter } = usePharmacySelection();

  // Données simulées de pharmacies
  const [pharmacies] = useState<Pharmacy[]>([
    { id: '1', name: 'Pharmacie Centrale', region: 'Île-de-France', revenue: '> 2M€', size: 'Grande' },
    { id: '2', name: 'Pharmacie du Marché', region: 'Île-de-France', revenue: '1-2M€', size: 'Moyenne' },
    { id: '3', name: 'Pharmacie Lafayette', region: 'Occitanie', revenue: '> 2M€', size: 'Grande' },
    { id: '4', name: 'Pharmacie des Halles', region: 'Bretagne', revenue: '< 1M€', size: 'Petite' },
    { id: '5', name: 'Pharmacie Saint-Michel', region: 'Bretagne', revenue: '1-2M€', size: 'Moyenne' },
    { id: '6', name: 'Grande Pharmacie', region: 'PACA', revenue: '> 2M€', size: 'Grande' },
    { id: '7', name: 'Pharmacie du Port', region: 'PACA', revenue: '1-2M€', size: 'Moyenne' },
    { id: '8', name: 'Pharmacie Mutualiste', region: 'Auvergne-Rhône-Alpes', revenue: '> 2M€', size: 'Grande' },
    { id: '9', name: 'Pharmacie de la Mairie', region: 'Auvergne-Rhône-Alpes', revenue: '< 1M€', size: 'Petite' },
    { id: '10', name: 'Pharmacie du Centre', region: 'Grand Est', revenue: '1-2M€', size: 'Moyenne' },
  ]);

  // Extraction des valeurs uniques pour les filtres
  const regions = [...new Set(pharmacies.map(p => p.region))];
  const revenueBrackets = [...new Set(pharmacies.map(p => p.revenue))];
  const sizes = [...new Set(pharmacies.map(p => p.size))];

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrer les pharmacies en fonction de la recherche
  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Vérifier si toutes les pharmacies sont sélectionnées
  const allSelected = selectedPharmacies.length === pharmacies.length;
  
  // Sélectionner ou désélectionner toutes les pharmacies
  const toggleSelectAll = () => {
    if (allSelected) {
      onPharmacyChange([]);
      // Réinitialiser les filtres si on désélectionne tout
      setLastFilterType('none');
      setSelectedFilter(null);
    } else {
      onPharmacyChange(pharmacies.map(p => p.id));
    }
  };

  // Sélectionner ou désélectionner une pharmacie
  const togglePharmacy = (id: string) => {
    if (selectedPharmacies.includes(id)) {
      onPharmacyChange(selectedPharmacies.filter(pharmId => pharmId !== id));
    } else {
      onPharmacyChange([...selectedPharmacies, id]);
    }
  };

  // Appliquer un filtre de région
  const applyRegionFilter = (region: string) => {
    const pharmaciesInRegion = pharmacies.filter(p => p.region === region).map(p => p.id);
    onPharmacyChange(pharmaciesInRegion);
    setLastFilterType('region');
    setSelectedFilter(region);
    setIsOpen(false);
  };

  // Appliquer un filtre de CA
  const applyRevenueFilter = (revenue: string) => {
    const pharmaciesWithRevenue = pharmacies.filter(p => p.revenue === revenue).map(p => p.id);
    onPharmacyChange(pharmaciesWithRevenue);
    setLastFilterType('revenue');
    setSelectedFilter(revenue);
    setIsOpen(false);
  };

  // Appliquer un filtre de taille
  const applySizeFilter = (size: string) => {
    const pharmaciesWithSize = pharmacies.filter(p => p.size === size).map(p => p.id);
    onPharmacyChange(pharmaciesWithSize);
    setLastFilterType('size');
    setSelectedFilter(size);
    setIsOpen(false);
  };

  // Formater le texte d'affichage du bouton
  const getDisplayText = () => {
    if (selectedPharmacies.length === 0) {
      return 'Aucune pharmacie';
    } else if (allSelected) {
      return 'Toutes les pharmacies';
    } else if (selectedPharmacies.length === 1) {
      const selected = pharmacies.find(p => p.id === selectedPharmacies[0]);
      return selected ? selected.name : 'Une pharmacie';
    } else {
      // Afficher un texte basé sur le filtre si disponible
      if (lastFilterType !== 'none' && selectedFilter) {
        switch (lastFilterType) {
          case 'region': return `${selectedPharmacies.length} pharmacies · ${selectedFilter}`;
          case 'revenue': return `${selectedPharmacies.length} pharmacies · CA: ${selectedFilter}`;
          case 'size': return `${selectedPharmacies.length} pharmacies · ${selectedFilter}`;
        }
      }
      return `${selectedPharmacies.length} pharmacies`;
    }
  };

  // Obtenir l'icône en fonction du type de filtre actif
  const getFilterIcon = () => {
    if (lastFilterType === 'none') return null;
    
    switch (lastFilterType) {
      case 'region': return <FiMap className="mr-2" size={16} />;
      case 'revenue': return <FiDollarSign className="mr-2" size={16} />;
      case 'size': return <FiMaximize className="mr-2" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
      >
        {getFilterIcon()}
        <span className={lastFilterType !== 'none' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}>
          {getDisplayText()}
        </span>
        {isOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('pharmacies')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'pharmacies'
                  ? 'text-indigo-600 border-b-2 border-indigo-500 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <FiUsers className="mr-2" size={16} />
                Pharmacies
              </div>
            </button>
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'filters'
                  ? 'text-indigo-600 border-b-2 border-indigo-500 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <FiFilter className="mr-2" size={16} />
                Filtres rapides
              </div>
            </button>
          </div>

          {activeTab === 'pharmacies' ? (
            <>
              {/* Barre de recherche */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une pharmacie..."
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                {/* Option "Toutes les pharmacies" */}
                <div className="mt-3 flex items-center">
                  <button 
                    onClick={toggleSelectAll}
                    className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-colors ${
                      allSelected 
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className={`w-5 h-5 mr-3 flex items-center justify-center rounded-md border ${
                      allSelected 
                        ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {allSelected && <FiCheck className="text-white" size={14} />}
                    </div>
                    Toutes les pharmacies
                  </button>
                </div>
              </div>
              
              {/* Options de regroupement */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Regrouper par
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setGroupBy('region')}
                      className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        groupBy === 'region' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <FiMap className="mr-1" size={12} /> Région
                    </button>
                    <button
                      onClick={() => setGroupBy('revenue')}
                      className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        groupBy === 'revenue' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <FiDollarSign className="mr-1" size={12} /> CA
                    </button>
                    <button
                      onClick={() => setGroupBy('size')}
                      className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        groupBy === 'size' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <FiMaximize className="mr-1" size={12} /> Taille
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Liste des pharmacies */}
              <div className="overflow-y-auto flex-grow">
                {groupBy === 'none' ? (
                  <div className="p-3">
                    {filteredPharmacies.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Aucune pharmacie trouvée
                      </div>
                    ) : (
                      filteredPharmacies.map((pharmacy) => (
                        <div key={pharmacy.id} className="mb-1 last:mb-0">
                          <button
                            onClick={() => togglePharmacy(pharmacy.id)}
                            className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-colors ${
                              selectedPharmacies.includes(pharmacy.id) 
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className={`w-5 h-5 mr-3 flex items-center justify-center rounded-md border ${
                              selectedPharmacies.includes(pharmacy.id) 
                                ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {selectedPharmacies.includes(pharmacy.id) && <FiCheck className="text-white" size={14} />}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{pharmacy.name}</div>
                              <div className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
                                {pharmacy.region} · {pharmacy.revenue} · {pharmacy.size}
                              </div>
                            </div>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  // Affichage groupé
                  <div>
                    {groupBy === 'region' && (
                      <>
                        {regions.map(region => {
                          const pharmaciesInRegion = filteredPharmacies.filter(p => p.region === region);
                          if (pharmaciesInRegion.length === 0) return null;
                          
                          const allInRegionSelected = pharmaciesInRegion.every(p => selectedPharmacies.includes(p.id));
                          const someInRegionSelected = pharmaciesInRegion.some(p => selectedPharmacies.includes(p.id));
                          
                          return (
                            <div key={region} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                                <div className="flex items-center">
                                  <FiMap className="mr-2 text-indigo-500 dark:text-indigo-400" size={16} />
                                  <span className="font-medium text-gray-700 dark:text-gray-300">{region}</span>
                                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                    ({pharmaciesInRegion.length})
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (allInRegionSelected) {
                                      // Désélectionner toutes les pharmacies de cette région
                                      onPharmacyChange(selectedPharmacies.filter(id => 
                                        !pharmaciesInRegion.some(p => p.id === id)
                                      ));
                                    } else {
                                      // Sélectionner toutes les pharmacies de cette région
                                      const newSelection = [...new Set([
                                        ...selectedPharmacies,
                                        ...pharmaciesInRegion.map(p => p.id)
                                      ])];
                                      onPharmacyChange(newSelection);
                                    }
                                  }}
                                  className={`text-xs font-medium px-2 py-1 rounded ${
                                    allInRegionSelected
                                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {allInRegionSelected ? 'Désélectionner' : 'Sélectionner'}
                                </button>
                              </div>
                              <div className="p-2">
                                {pharmaciesInRegion.map(pharmacy => (
                                  <div key={pharmacy.id} className="mb-1 last:mb-0">
                                    <button
                                      onClick={() => togglePharmacy(pharmacy.id)}
                                      className={`flex items-center w-full py-2 px-2 rounded-md text-sm transition-colors ${
                                        selectedPharmacies.includes(pharmacy.id) 
                                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                      }`}
                                    >
                                      <div className={`w-5 h-5 mr-2 flex items-center justify-center rounded-md border ${
                                        selectedPharmacies.includes(pharmacy.id) 
                                          ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
                                          : 'border-gray-300 dark:border-gray-600'
                                      }`}>
                                        {selectedPharmacies.includes(pharmacy.id) && <FiCheck className="text-white" size={14} />}
                                      </div>
                                      <div className="flex-1 flex flex-col">
                                        <span className="font-medium">{pharmacy.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {pharmacy.revenue} · {pharmacy.size}
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                    
                    {groupBy === 'revenue' && (
                      <>
                        {revenueBrackets.map(revenue => {
                          const pharmaciesWithRevenue = filteredPharmacies.filter(p => p.revenue === revenue);
                          if (pharmaciesWithRevenue.length === 0) return null;
                          
                          const allWithRevenueSelected = pharmaciesWithRevenue.every(p => selectedPharmacies.includes(p.id));
                          
                          return (
                            <div key={revenue} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                                <div className="flex items-center">
                                  <FiDollarSign className="mr-2 text-emerald-500 dark:text-emerald-400" size={16} />
                                  <span className="font-medium text-gray-700 dark:text-gray-300">CA: {revenue}</span>
                                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                    ({pharmaciesWithRevenue.length})
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (allWithRevenueSelected) {
                                      onPharmacyChange(selectedPharmacies.filter(id => 
                                        !pharmaciesWithRevenue.some(p => p.id === id)
                                      ));
                                    } else {
                                      const newSelection = [...new Set([
                                        ...selectedPharmacies,
                                        ...pharmaciesWithRevenue.map(p => p.id)
                                      ])];
                                      onPharmacyChange(newSelection);
                                    }
                                  }}
                                  className={`text-xs font-medium px-2 py-1 rounded ${
                                    allWithRevenueSelected
                                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {allWithRevenueSelected ? 'Désélectionner' : 'Sélectionner'}
                                </button>
                              </div>
                              <div className="p-2">
                                {pharmaciesWithRevenue.map(pharmacy => (
                                  <div key={pharmacy.id} className="mb-1 last:mb-0">
                                    <button
                                      onClick={() => togglePharmacy(pharmacy.id)}
                                      className={`flex items-center w-full py-2 px-2 rounded-md text-sm transition-colors ${
                                        selectedPharmacies.includes(pharmacy.id) 
                                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                      }`}
                                    >
                                      <div className={`w-5 h-5 mr-2 flex items-center justify-center rounded-md border ${
                                        selectedPharmacies.includes(pharmacy.id) 
                                          ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
                                          : 'border-gray-300 dark:border-gray-600'
                                      }`}>
                                        {selectedPharmacies.includes(pharmacy.id) && <FiCheck className="text-white" size={14} />}
                                      </div>
                                      <div className="flex-1 flex flex-col">
                                        <span className="font-medium">{pharmacy.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {pharmacy.region} · {pharmacy.size}
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                    
                    {groupBy === 'size' && (
                      <>
                        {sizes.map(size => {
                          const pharmaciesWithSize = filteredPharmacies.filter(p => p.size === size);
                          if (pharmaciesWithSize.length === 0) return null;
                          
                          const allWithSizeSelected = pharmaciesWithSize.every(p => selectedPharmacies.includes(p.id));
                          
                          return (
                            <div key={size} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                                <div className="flex items-center">
                                  <FiMaximize className="mr-2 text-amber-500 dark:text-amber-400" size={16} />
                                  <span className="font-medium text-gray-700 dark:text-gray-300">{size}</span>
                                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                    ({pharmaciesWithSize.length})
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (allWithSizeSelected) {
                                      onPharmacyChange(selectedPharmacies.filter(id => 
                                        !pharmaciesWithSize.some(p => p.id === id)
                                      ));
                                    } else {
                                      const newSelection = [...new Set([
                                        ...selectedPharmacies,
                                        ...pharmaciesWithSize.map(p => p.id)
                                      ])];
                                      onPharmacyChange(newSelection);
                                    }
                                  }}
                                  className={`text-xs font-medium px-2 py-1 rounded ${
                                    allWithSizeSelected
                                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {allWithSizeSelected ? 'Désélectionner' : 'Sélectionner'}
                                </button>
                              </div>
                              <div className="p-2">
                                {pharmaciesWithSize.map(pharmacy => (
                                  <div key={pharmacy.id} className="mb-1 last:mb-0">
                                    <button
                                      onClick={() => togglePharmacy(pharmacy.id)}
                                      className={`flex items-center w-full py-2 px-2 rounded-md text-sm transition-colors ${
                                        selectedPharmacies.includes(pharmacy.id) 
                                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                      }`}
                                    >
                                      <div className={`w-5 h-5 mr-2 flex items-center justify-center rounded-md border ${
                                        selectedPharmacies.includes(pharmacy.id) 
                                          ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
                                          : 'border-gray-300 dark:border-gray-600'
                                      }`}>
                                        {selectedPharmacies.includes(pharmacy.id) && <FiCheck className="text-white" size={14} />}
                                      </div>
                                      <div className="flex-1 flex flex-col">
                                        <span className="font-medium">{pharmacy.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {pharmacy.region} · {pharmacy.revenue}
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Onglet des filtres (nouvelle interface plus intuitive)
            <div className="overflow-y-auto flex-grow p-3">
              {/* Info explicative */}
              <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                <div className="flex items-start">
                  <FiInfo className="text-indigo-500 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" size={16} />
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Sélectionnez un filtre pour rapidement afficher un groupe de pharmacies ayant les mêmes caractéristiques.
                  </p>
                </div>
              </div>
              
              {/* Filtres par région */}
              <div className="mb-4">
                <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiMap className="mr-2 text-indigo-500 dark:text-indigo-400" size={16} />
                  Régions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {regions.map(region => (
                    <button
                      key={region}
                      onClick={() => applyRegionFilter(region)}
                      className="flex items-center justify-between p-2 rounded-lg text-left text-sm border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-700 transition-colors"
                    >
                      <div className="font-medium text-gray-700 dark:text-gray-300 truncate">{region}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                        {pharmacies.filter(p => p.region === region).length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filtres par CA */}
              <div className="mb-4">
                <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiDollarSign className="mr-2 text-emerald-500 dark:text-emerald-400" size={16} />
                  Chiffre d'affaires
                </h4>
                <div className="space-y-2">
                  {revenueBrackets.map(revenue => (
                    <button
                      key={revenue}
                      onClick={() => applyRevenueFilter(revenue)}
                      className="flex items-center justify-between w-full p-2 rounded-lg text-left text-sm border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-700 transition-colors"
                    >
                      <div className="font-medium text-gray-700 dark:text-gray-300">{revenue}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                        {pharmacies.filter(p => p.revenue === revenue).length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filtres par taille */}
              <div>
                <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiMaximize className="mr-2 text-amber-500 dark:text-amber-400" size={16} />
                  Superficie
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => applySizeFilter(size)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg text-center text-sm border border-gray-200 dark:border-gray-700 hover:bg-amber-50 hover:border-amber-200 dark:hover:bg-amber-900/20 dark:hover:border-amber-700 transition-colors"
                    >
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">{size}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                        {pharmacies.filter(p => p.size === size).length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Bas du sélecteur avec les actions */}
          <div className="p-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {selectedPharmacies.length === 0 ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">Aucune sélection</span>
              ) : (
                <span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{selectedPharmacies.length}</span> pharmacie{selectedPharmacies.length > 1 ? 's' : ''} sélectionnée{selectedPharmacies.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              {/* Bouton pour réinitialiser les filtres */}
              {lastFilterType !== 'none' && (
                <button
                  onClick={() => {
                    setLastFilterType('none');
                    setSelectedFilter(null);
                    // Si on veut garder la sélection mais juste supprimer le filtre
                    // Ne rien faire d'autre
                    // Ou si on veut aussi réinitialiser la sélection:
                    // onPharmacyChange([]);
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiX className="inline-block mr-1" size={12} />
                  Effacer filtre
                </button>
              )}
              
              {/* Bouton pour appliquer les sélections */}
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                <FiCheckCircle className="inline-block mr-1" size={12} />
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}