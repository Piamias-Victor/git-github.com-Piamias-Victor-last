'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiPieChart, FiGrid, FiTrendingUp, FiCalendar, FiPackage, FiLayers, FiBarChart2, FiList } from 'react-icons/fi';
import Link from 'next/link';
import { createUrlWithCurrentDateParams } from '@/utils/navigationUtils';
import { useDateRange } from '@/providers/DateRangeProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { MarketStickyNav } from '@/components/dashboard/markets/MarketStickyNav';
import { MarketStats } from '@/components/dashboard/markets/MarketStats';
import { MarketSegmentTable } from '@/components/dashboard/markets/MarketSegmentTable';
import { MarketHierarchyVisualization } from '@/components/dashboard/markets/visualization/MarketHierarchyVisualization';
import { MarketTreeMap } from '@/components/dashboard/markets/visualization/MarketTreeMap';
import { MarketSalesChart } from '@/components/dashboard/markets/charts/MarketSalesChart';
import { MarketEvolutionChart } from '@/components/dashboard/markets/charts/MarketEvolutionChart';
import { MarketSeasonalityChart } from '@/components/dashboard/markets/charts/MarketSeasonalityChart';
import { TopLaboratoriesChart } from '@/components/dashboard/markets/TopLaboratoriesChart';
import { LoadingState } from '@/components/ui/LoadingState';
import { 
  getMockSegments, 
  mockUniverses, 
  mockCategories, 
  mockSubCategories, 
  mockFamilies, 
  mockSubFamilies, 
  mockSpecificities,
  mockLabs
} from '@/utils/marketSegmentData';

// Types
export interface MarketSegment {
  id: string;
  name: string;
  type: 'universe' | 'category' | 'sub_category' | 'family' | 'sub_family' | 'specificity' | 'lab_distributor' | 'brand_lab' | 'range_name';
  parent?: string;
  products: number;
  revenue: number;
  growth: string;
  marketShare: string;
  dominantLab?: string;
}

export default function MarketAnalysisPage() {
  // États pour la gestion des segments et de la recherche
  const [searchResults, setSearchResults] = useState<MarketSegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [segmentType, setSegmentType] = useState<string>('universe');
  const [isLoading, setIsLoading] = useState(false);
  
  // Référence pour le conteneur principal pour contrôler le défilement
  const mainContainerRef = useRef<HTMLDivElement>(null);
  
  // Accès aux dates depuis le contexte
  const { startDate, endDate } = useDateRange();
  
  // Effet pour charger les données initiales
  useEffect(() => {
    // Charger quelques données par défaut au démarrage
    setSearchResults(mockUniverses);
  }, []);

  // Effet pour surveiller le défilement et mettre à jour la section active
  useEffect(() => {
    const handleScroll = () => {
      if (!mainContainerRef.current) return;
      
      const sections = [
        'overview', 'hierarchy', 'sales', 'evolution', 
        'seasonal', 'laboratories', 'products', 'segments'
      ];
      
      // Trouver la section visible
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

  // Fonction pour rechercher des segments
  const handleSearch = (segments: MarketSegment[]) => {
    setIsLoading(true);
    
    // Simuler un délai réseau
    setTimeout(() => {
      setSearchResults(segments.length > 0 ? segments : getMockSegments(segmentType));
      setSelectedSegment(null);
      setIsLoading(false);
      
      // Faire défiler vers le haut
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  // Fonction pour sélectionner un segment pour analyse détaillée
  const handleSegmentSelect = (segment: MarketSegment) => {
    setSelectedSegment(segment);
    // Faire défiler vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Réinitialiser la section active
    setActiveSection('overview');
  };

  // Fonction pour changer le type de segment
  const handleSegmentTypeChange = (type: string) => {
    setSegmentType(type);
    // Ne pas réinitialiser tout de suite, laissons la recherche s'en charger
  };
  
  // Fonction pour rechercher tous les segments disponibles
  const searchAllSegments = (searchTerm: string): MarketSegment[] => {
    const allSegments = [
      ...mockUniverses,
      ...mockCategories, 
      ...mockSubCategories,
      ...mockFamilies,
      ...mockSubFamilies,
      ...mockSpecificities
    ];
    
    if (!searchTerm.trim()) return allSegments;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allSegments.filter(segment => 
      segment.name.toLowerCase().includes(lowerSearchTerm) ||
      (segment.dominantLab && segment.dominantLab.toLowerCase().includes(lowerSearchTerm))
    );
  };

  // Si aucun segment sélectionné, afficher la vue d'ensemble des segments
  const segmentsToShow = selectedSegment ? [selectedSegment] : searchResults;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" ref={mainContainerRef}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href={createUrlWithCurrentDateParams("/dashboard/detailed-analysis")}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiArrowLeft className="mr-2" /> Retour à l'analyse détaillée
          </Link>
        </div>
        
        <DashboardHeader 
          title={selectedSegment 
            ? `Analyse du segment : ${selectedSegment.name}` 
            : "Analyse par Marché"}
          subtitle={selectedSegment 
            ? `Exploration détaillée du segment ${selectedSegment.type} avec ${selectedSegment.products} produits` 
            : "Explorez les tendances par segment de marché ou catégorie"}
        />
        
        {/* Header avec navigation sticky */}
        <MarketStickyNav 
          onSearch={handleSearch}
          activeSection={activeSection}
          showNavigation={searchResults.length > 0}
          segmentType={segmentType}
          onSegmentTypeChange={handleSegmentTypeChange}
          searchAllSegments={searchAllSegments}
        />
        
        {/* Afficher l'état de chargement */}
        {isLoading && (
          <LoadingState height="40" message="Analyse des données de marché en cours..." />
        )}
        
        {/* Message si aucun résultat */}
        {!isLoading && searchResults.length === 0 && (
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Utilisez la barre de recherche pour explorer les segments de marché
            </p>
          </div>
        )}
        
        {/* Contenu principal avec sections */}
        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-8 pt-4">
            {/* Section Vue d'ensemble */}
            <SectionContainer
              id="overview"
              title="Vue d'ensemble du marché"
              subtitle={selectedSegment 
                ? `Analyse synthétique du segment ${selectedSegment.name}` 
                : `${searchResults.length} segments analysés`}
              icon={<FiPieChart size={22} />}
            >
              <MarketStats 
                segments={segmentsToShow} 
                type={selectedSegment?.type || segmentType as any}
              />
            </SectionContainer>
            
            {/* Section Hiérarchie */}
            <SectionContainer
              id="hierarchy"
              title="Hiérarchie des segments"
              subtitle="Organisation et structure du marché"
              icon={<FiGrid size={22} />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MarketHierarchyVisualization 
                  segments={segmentsToShow} 
                  type={selectedSegment?.type || segmentType as any}
                  onSegmentSelect={handleSegmentSelect} 
                />
                <MarketTreeMap 
                  segments={segmentsToShow} 
                  type={selectedSegment?.type || segmentType as any} 
                  onSegmentSelect={handleSegmentSelect}
                />
              </div>
            </SectionContainer>
            
            {/* Section Ventes */}
            <SectionContainer
              id="sales"
              title="Analyse des ventes"
              subtitle="Répartition du chiffre d'affaires par période"
              icon={<FiBarChart2 size={22} />}
            >
              <MarketSalesChart 
                segments={segmentsToShow} 
                startDate={startDate} 
                endDate={endDate}
              />
            </SectionContainer>
            
            {/* Section Évolution */}
            <SectionContainer
              id="evolution"
              title="Évolution du marché"
              subtitle="Tendances observées sur 5 ans"
              icon={<FiTrendingUp size={22} />}
            >
              <MarketEvolutionChart 
                segments={segmentsToShow} 
                startDate={startDate} 
                endDate={endDate}
              />
            </SectionContainer>
            
            {/* Section Saisonnalité */}
            <SectionContainer
              id="seasonal"
              title="Saisonnalité"
              subtitle="Variations mensuelles et cycles de vente"
              icon={<FiCalendar size={22} />}
            >
              <MarketSeasonalityChart segments={segmentsToShow} />
            </SectionContainer>
            
            {/* Section Laboratoires */}
            <SectionContainer
              id="laboratories"
              title="Laboratoires dominants"
              subtitle="Répartition des parts de marché par laboratoire"
              icon={<FiPackage size={22} />}
            >
              <TopLaboratoriesChart segments={segmentsToShow} />
            </SectionContainer>
            
            {/* Section Liste des segments */}
            <SectionContainer
              id="segments"
              title="Liste des segments"
              subtitle="Détail complet de tous les segments analysés"
              icon={<FiList size={22} />}
            >
              <MarketSegmentTable 
                segments={searchResults} 
                onSegmentSelect={handleSegmentSelect}
              />
            </SectionContainer>
          </div>
        )}
      </div>
    </div>
  );
}