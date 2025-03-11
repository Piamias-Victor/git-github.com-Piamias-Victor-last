// src/components/shared/AdvancedPharmacySelector.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch, FiX, FiMap, FiDollarSign, FiMaximize } from 'react-icons/fi';

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

  // Sélectionner toutes les pharmacies d'un groupe
  const selectGroup = (groupValue: string) => {
    let groupPharmacies: string[] = [];
    
    switch (groupBy) {
      case 'region':
        groupPharmacies = pharmacies
          .filter(p => p.region === groupValue)
          .map(p => p.id);
        break;
      case 'revenue':
        groupPharmacies = pharmacies
          .filter(p => p.revenue === groupValue)
          .map(p => p.id);
        break;
      case 'size':
        groupPharmacies = pharmacies
          .filter(p => p.size === groupValue)
          .map(p => p.id);
        break;
    }
    
    // Ajouter les pharmacies du groupe aux sélections actuelles
    const newSelection = [...new Set([...selectedPharmacies, ...groupPharmacies])];
    onPharmacyChange(newSelection);
  };

  // Désélectionner toutes les pharmacies d'un groupe
  const deselectGroup = (groupValue: string) => {
    let groupPharmacies: string[] = [];
    
    switch (groupBy) {
      case 'region':
        groupPharmacies = pharmacies
          .filter(p => p.region === groupValue)
          .map(p => p.id);
        break;
      case 'revenue':
        groupPharmacies = pharmacies
          .filter(p => p.revenue === groupValue)
          .map(p => p.id);
        break;
      case 'size':
        groupPharmacies = pharmacies
          .filter(p => p.size === groupValue)
          .map(p => p.id);
        break;
    }
    
    // Retirer les pharmacies du groupe des sélections actuelles
    const newSelection = selectedPharmacies.filter(id => !groupPharmacies.includes(id));
    onPharmacyChange(newSelection);
  };

  // Regrouper les pharmacies par critère
  const groupPharmacies = () => {
    if (groupBy === 'none') {
      return { 'Toutes les pharmacies': filteredPharmacies };
    }

    const groups: Record<string, Pharmacy[]> = {};
    
    filteredPharmacies.forEach(pharmacy => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'region':
          groupKey = pharmacy.region;
          break;
        case 'revenue':
          groupKey = pharmacy.revenue;
          break;
        case 'size':
          groupKey = pharmacy.size;
          break;
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(pharmacy);
    });
    
    return groups;
  };

  // Vérifier si tous les membres d'un groupe sont sélectionnés
  const isGroupFullySelected = (groupPharmacies: Pharmacy[]) => {
    return groupPharmacies.every(pharmacy => selectedPharmacies.includes(pharmacy.id));
  };

  // Vérifier si certains membres d'un groupe sont sélectionnés (mais pas tous)
  const isGroupPartiallySelected = (groupPharmacies: Pharmacy[]) => {
    const selected = groupPharmacies.some(pharmacy => selectedPharmacies.includes(pharmacy.id));
    const all = groupPharmacies.every(pharmacy => selectedPharmacies.includes(pharmacy.id));
    return selected && !all;
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
      return `${selectedPharmacies.length} pharmacies`;
    }
  };

  // Changer l'icône en fonction du type de regroupement
  const getGroupIcon = () => {
    switch (groupBy) {
      case 'region':
        return <FiMap size={16} />;
      case 'revenue':
        return <FiDollarSign size={16} />;
      case 'size':
        return <FiMaximize size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span className="mr-2">{getDisplayText()}</span>
        {isOpen ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('pharmacies')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'pharmacies'
                  ? 'text-indigo-600 border-b-2 border-indigo-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Pharmacies
            </button>
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'filters'
                  ? 'text-indigo-600 border-b-2 border-indigo-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Filtres
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
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Options de regroupement */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Regrouper par
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setGroupBy('none')}
                      className={`px-2 py-1 text-xs rounded ${
                        groupBy === 'none' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      Aucun
                    </button>
                    <button
                      onClick={() => setGroupBy('region')}
                      className={`px-2 py-1 text-xs rounded flex items-center ${
                        groupBy === 'region' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FiMap className="mr-1" size={12} /> Région
                    </button>
                    <button
                      onClick={() => setGroupBy('revenue')}
                      className={`px-2 py-1 text-xs rounded flex items-center ${
                        groupBy === 'revenue' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FiDollarSign className="mr-1" size={12} /> CA
                    </button>
                    <button
                      onClick={() => setGroupBy('size')}
                      className={`px-2 py-1 text-xs rounded flex items-center ${
                        groupBy === 'size' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FiMaximize className="mr-1" size={12} /> Taille
                    </button>
                  </div>
                </div>
                
                {/* Option pour sélectionner toutes les pharmacies */}
                <div className="flex items-center py-1">
                  <label className="flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Toutes les pharmacies</span>
                  </label>
                </div>
              </div>
              
              {/* Liste des pharmacies groupées */}
              <div className="max-h-64 overflow-y-auto">
                {Object.entries(groupPharmacies()).map(([groupName, groupItems]) => (
                  <div key={groupName} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    {groupBy !== 'none' && (
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center">
                          {getGroupIcon()}
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{groupName}</span>
                          <span className="ml-1 text-xs text-gray-500">({groupItems.length})</span>
                        </div>
                        <div>
                          {isGroupFullySelected(groupItems) ? (
                            <button
                              onClick={() => deselectGroup(groupName)}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Désélectionner tout
                            </button>
                          ) : (
                            <button
                              onClick={() => selectGroup(groupName)}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Sélectionner tout
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="px-3 py-1">
                      {groupItems.map((pharmacy) => (
                        <div key={pharmacy.id} className="flex items-center py-1">
                          <label className="flex items-center w-full cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedPharmacies.includes(pharmacy.id)}
                              onChange={() => togglePharmacy(pharmacy.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 w-full">
                              {pharmacy.name}
                              <span className="ml-2 text-xs text-gray-500 block sm:inline">
                                {groupBy !== 'region' && `${pharmacy.region} · `}
                                {groupBy !== 'revenue' && `${pharmacy.revenue} · `}
                                {groupBy !== 'size' && pharmacy.size}
                              </span>
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Onglet des filtres
            <div className="p-3">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Régions</h4>
                <div className="space-y-1">
                  {regions.map(region => (
                    <button
                      key={region}
                      onClick={() => selectGroup(region)}
                      className="flex items-center w-full py-1 px-2 rounded text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiMap className="mr-2 text-gray-500" size={14} />
                      {region}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chiffre d'affaires</h4>
                <div className="space-y-1">
                  {revenueBrackets.map(revenue => (
                    <button
                      key={revenue}
                      onClick={() => selectGroup(revenue)}
                      className="flex items-center w-full py-1 px-2 rounded text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiDollarSign className="mr-2 text-gray-500" size={14} />
                      {revenue}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Superficie</h4>
                <div className="space-y-1">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => selectGroup(size)}
                      className="flex items-center w-full py-1 px-2 rounded text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiMaximize className="mr-2 text-gray-500" size={14} />
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="p-3 flex justify-between border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500">
              {selectedPharmacies.length} sélectionné(s)
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}