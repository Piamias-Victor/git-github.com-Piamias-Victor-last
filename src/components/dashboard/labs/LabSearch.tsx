// src/components/dashboard/labs/LabSearch.tsx
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface LabSearchProps {
  onSearch: (results: any[]) => void;
}

/**
 * Composant de recherche de laboratoires
 * Permet de rechercher un laboratoire par son nom
 */
export function LabSearch({ onSearch }: LabSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fonction pour traiter la recherche
  const handleSearch = () => {
    // Simuler des résultats pour la démonstration
    // Dans une app réelle, ce serait un appel API
    const mockResults = generateMockLabResults(searchTerm);
    onSearch(mockResults);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recherche de laboratoires
          </h3>
        </div>
        
        <div className="mt-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Rechercher un laboratoire (ex: Sanofi, Pfizer, etc.)"
            />
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiSearch className="mr-2" size={16} />
          Rechercher
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
    { id: 'lab1', name: 'Sanofi', products: 142, revenue: 1850000, growth: '+5.2%', margin: '29.8%' },
    { id: 'lab2', name: 'Pfizer', products: 128, revenue: 1620000, growth: '+7.4%', margin: '28.5%' },
    { id: 'lab3', name: 'Novartis', products: 115, revenue: 1485000, growth: '+3.8%', margin: '30.2%' },
    { id: 'lab4', name: 'Bayer', products: 96, revenue: 1320000, growth: '+2.1%', margin: '26.7%' },
    { id: 'lab5', name: 'Roche', products: 88, revenue: 1275000, growth: '+4.5%', margin: '31.4%' },
    { id: 'lab6', name: 'GSK', products: 76, revenue: 1145000, growth: '+1.8%', margin: '27.3%' },
    { id: 'lab7', name: 'Johnson & Johnson', products: 104, revenue: 1390000, growth: '+6.2%', margin: '32.1%' },
    { id: 'lab8', name: 'AstraZeneca', products: 92, revenue: 1180000, growth: '+8.5%', margin: '30.8%' },
    { id: 'lab9', name: 'Merck', products: 85, revenue: 1250000, growth: '+4.9%', margin: '29.5%' },
    { id: 'lab10', name: 'Eli Lilly', products: 68, revenue: 985000, growth: '+5.7%', margin: '28.9%' },
    { id: 'lab11', name: 'Bristol-Myers Squibb', products: 72, revenue: 1050000, growth: '+3.2%', margin: '27.6%' },
    { id: 'lab12', name: 'Biogaran', products: 156, revenue: 1420000, growth: '+6.8%', margin: '24.3%' },
    { id: 'lab13', name: 'Mylan', products: 102, revenue: 950000, growth: '+1.5%', margin: '23.8%' },
    { id: 'lab14', name: 'Teva', products: 118, revenue: 1080000, growth: '-0.8%', margin: '22.5%' },
    { id: 'lab15', name: 'Servier', products: 89, revenue: 920000, growth: '+2.7%', margin: '26.2%' }
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