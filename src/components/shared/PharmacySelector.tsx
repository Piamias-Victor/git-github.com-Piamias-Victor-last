// src/components/shared/PharmacySelector.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Pharmacy {
  id: string;
  name: string;
}

interface PharmacySelectorProps {
  selectedPharmacies: string[];
  onPharmacyChange: (pharmacyIds: string[]) => void;
}

export function PharmacySelector({ selectedPharmacies, onPharmacyChange }: PharmacySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    { id: '1', name: 'Pharmacie Centrale' },
    { id: '2', name: 'Pharmacie du Marché' },
    { id: '3', name: 'Pharmacie Lafayette' },
    { id: '4', name: 'Pharmacie des Halles' },
    { id: '5', name: 'Pharmacie Saint-Michel' },
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Formater le texte d'affichage
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
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pharmacies</div>
            
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

            {/* Ligne de séparation */}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            
            {/* Liste des pharmacies */}
            <div className="max-h-56 overflow-y-auto">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="flex items-center py-1">
                  <label className="flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPharmacies.includes(pharmacy.id)}
                      onChange={() => togglePharmacy(pharmacy.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{pharmacy.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-2 flex justify-end border-t border-gray-200 dark:border-gray-700">
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