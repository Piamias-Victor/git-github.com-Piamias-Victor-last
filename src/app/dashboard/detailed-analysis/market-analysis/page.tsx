'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { MarketSegment, getMockSegments } from '@/utils/marketSegmentData';
import { MarketStickyNav } from '@/components/dashboard/markets/MarketStickyNav';

export default function MarketAnalysisPage() {
  // États
  const [searchResults, setSearchResults] = useState<MarketSegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [segmentType, setSegmentType] = useState<string>('universe');

  // Effet pour surveiller le défilement et mettre à jour la section active
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview', 'hierarchy', 'sales', 'evolution', 
        'seasonal', 'laboratories', 'products', 'segments'
      ];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour effectuer la recherche
  const handleSearch = (segments: MarketSegment[]) => {
    setSearchResults(segments.length > 0 ? segments : getMockSegments(segmentType));
    setSelectedSegment(null);
  };

  // Fonction pour changer le type de segment
  const handleSegmentTypeChange = (type: string) => {
    setSegmentType(type);
    setSelectedSegment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiArrowLeft className="mr-2" /> Retour au tableau de bord
          </Link>
        </div>
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedSegment 
              ? `Analyse de ${selectedSegment.name}` 
              : "Analyse par Marché"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {selectedSegment 
              ? `Exploration des données pour le segment ${selectedSegment.name}` 
              : "Explorez les tendances par segment de marché ou catégorie"}
          </p>
        </header>
        
        {/* Header avec navigation sticky */}
        <MarketStickyNav 
          onSearch={handleSearch}
          activeSection={activeSection}
          showNavigation={searchResults.length > 0}
          segmentType={segmentType}
          onSegmentTypeChange={handleSegmentTypeChange}
        />
        
        {/* Contenu principal avec effet de padding pour éviter que le contenu soit caché derrière le header sticky */}
        <div className="pt-4">
          {/* Message si aucun résultat */}
          {searchResults.length === 0 && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 text-center">
                Utilisez la barre de recherche pour explorer les segments de marché
              </p>
            </div>
          )}
          
          {/* Ici nous ajouterons plus tard les sections principales de la page */}
          {/* Pour l'instant, juste un placeholder pour montrer que la recherche fonctionne */}
          {searchResults.length > 0 && (
            <div id="overview" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Résultats de recherche
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(segment => (
                  <div 
                    key={segment.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {segment.name}
                      </h3>
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs">
                        {segment.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500 dark:text-gray-400">Produits:</div>
                      <div className="text-gray-900 dark:text-white font-medium text-right">{segment.products}</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">CA:</div>
                      <div className="text-gray-900 dark:text-white font-medium text-right">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(segment.revenue)}
                      </div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Croissance:</div>
                      <div className={`font-medium text-right ${
                        segment.growth.startsWith('-') 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {segment.growth}
                      </div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Part de marché:</div>
                      <div className="text-gray-900 dark:text-white font-medium text-right">{segment.marketShare}</div>
                    </div>
                    
                    {segment.dominantLab && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Laboratoire dominant: </span>
                        <span className="text-gray-900 dark:text-white font-medium">{segment.dominantLab}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setSelectedSegment(segment)}
                      className="mt-3 w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                    >
                      Voir les détails
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sections d'exemple pour la navigation */}
          {searchResults.length > 0 && (
            <>
              <div id="hierarchy" className="mt-8 h-32 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Section Hiérarchie (à implémenter)</p>
              </div>
              
              <div id="sales" className="mt-8 h-32 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Section Ventes (à implémenter)</p>
              </div>
              
              <div id="evolution" className="mt-8 h-32 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Section Évolution (à implémenter)</p>
              </div>
              
              <div id="seasonal" className="mt-8 h-32 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Section Saisonnalité (à implémenter)</p>
              </div>
              
              <div id="laboratories" className="mt-8 h-32 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Section Laboratoires (à implémenter)</p>
              </div>
              
              <div id="products" className="mt-8 h-32 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Section Produits (à implémenter)</p>
              </div>
              
              <div id="segments" className="mt-8 h-32 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Section Segments détaillés (à implémenter)</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}