'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft, FiGrid, FiTrendingUp, FiPackage, FiLayers } from 'react-icons/fi';
import { useDateRange } from '@/providers/DateRangeProvider';
import { createUrlWithCurrentDateParams } from '@/utils/navigationUtils';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { MarketEvolutionChart } from '@/components/dashboard/markets/charts/MarketEvolutionChart';
import { MarketSalesChart } from '@/components/dashboard/markets/charts/MarketSalesChart';
import { MarketSeasonalityChart } from '@/components/dashboard/markets/charts/MarketSeasonalityChart';
import { MarketSegmentTable } from '@/components/dashboard/markets/MarketSegmentTable';
import { MarketStats } from '@/components/dashboard/markets/MarketStats';
import { MarketStickyNav } from '@/components/dashboard/markets/MarketStickyNav';
import { TopLaboratoriesChart } from '@/components/dashboard/markets/TopLaboratoriesChart';
import { MarketHierarchyVisualization } from '@/components/dashboard/markets/visualization/MarketHierarchyVisualization';
import { MarketTreeMap } from '@/components/dashboard/markets/visualization/MarketTreeMap';


// Types pour les segments de marché
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

/**
 * Page d'analyse par marché
 * 
 * Cette page permet d'explorer les données par segment de marché
 * (univers, catégorie, famille, etc.)
 */
export default function MarketAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { startDate, endDate } = useDateRange();
  const [searchResults, setSearchResults] = useState<MarketSegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [segmentType, setSegmentType] = useState<string>('universe');

  // Simuler des données de test pour les segments de marché
  const mockSegments: MarketSegment[] = [
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
  ];

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
  }, [searchResults]);

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Fonction pour effectuer la recherche
  const handleSearch = (segments: MarketSegment[]) => {
    setSearchResults(segments.length > 0 ? segments : mockSegments);
    setSelectedSegment(null);
    setSegmentType(segments.length > 0 ? segments[0].type : 'universe');
  };

  // Fonction pour sélectionner un segment
  const handleSegmentSelect = (segment: MarketSegment) => {
    setSelectedSegment(segment);
  };

  // Fonction pour changer le type de segment
  const handleSegmentTypeChange = (type: string) => {
    setSegmentType(type);
    setSelectedSegment(null);
  };

  // Afficher un état de chargement si la session est en cours de chargement
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Si pas de session, ne rien afficher (la redirection se fera via useEffect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            ? `Analyse de ${selectedSegment.name} (${selectedSegment.type})` 
            : "Analyse par Marché"}
          subtitle={selectedSegment 
            ? `Exploration des données pour le segment ${selectedSegment.name}` 
            : "Explorez les tendances par segment de marché ou catégorie"}
        />
        
        {/* Header avec navigation sticky */}
        <MarketStickyNav 
          onSearch={handleSearch}
          activeSection={activeSection}
          showNavigation={searchResults.length > 0}
          segmentType={segmentType as any}
          onSegmentTypeChange={handleSegmentTypeChange}
        />
        
        {/* Contenu principal */}
        <div className="pt-4">
          {/* Vue d'ensemble des résultats */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="overview" 
              title="Vue d'ensemble du marché"
              subtitle={selectedSegment 
                ? `Synthèse pour ${selectedSegment.name}`
                : `Segments de type "${segmentType}" analysés`}
              icon={<FiGrid />}
            >
              <MarketStats 
                segments={selectedSegment ? [selectedSegment] : searchResults} 
                type={segmentType as any}
              />
            </SectionContainer>
          )}
          
          {/* Visualisation de la hiérarchie */}
          {searchResults.length > 0 && !selectedSegment && (
            <SectionContainer 
              id="hierarchy" 
              title="Visualisation des segments"
              subtitle={`Répartition et hiérarchie des ${segmentType}`}
              icon={<FiLayers />}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <MarketTreeMap 
                  segments={searchResults} 
                  type={segmentType as any}
                  onSegmentSelect={handleSegmentSelect}
                />
                <MarketHierarchyVisualization 
                  segments={searchResults}
                  type={segmentType as any}
                  onSegmentSelect={handleSegmentSelect}
                />
              </div>
            </SectionContainer>
          )}
          
          {/* Graphique des ventes */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="sales" 
              title="Analyse des ventes"
              subtitle={selectedSegment 
                ? `Performance de ${selectedSegment.name}`
                : "Comparaison des ventes par segment"}
              icon={<FiTrendingUp />}
            >
              <MarketSalesChart 
                segments={selectedSegment ? [selectedSegment] : searchResults} 
                startDate={startDate}
                endDate={endDate}
              />
            </SectionContainer>
          )}
          
          {/* Évolution du marché */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="evolution" 
              title="Évolution du marché"
              subtitle="Tendances à long terme et croissance"
              icon={<FiTrendingUp />}
            >
              <MarketEvolutionChart 
                segments={selectedSegment ? [selectedSegment] : searchResults} 
                startDate={startDate}
                endDate={endDate}
              />
            </SectionContainer>
          )}
          
          {/* Saisonnalité */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="seasonal" 
              title="Analyse saisonnière"
              subtitle="Impact des saisons sur les ventes"
              icon={<FiTrendingUp />}
            >
              <MarketSeasonalityChart 
                segments={selectedSegment ? [selectedSegment] : searchResults} 
              />
            </SectionContainer>
          )}
          
          {/* Top Laboratoires */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="laboratories" 
              title="Top Laboratoires"
              subtitle={selectedSegment 
                ? `Parts de marché sur ${selectedSegment.name}`
                : "Parts de marché par laboratoire"}
              icon={<FiPackage />}
            >
              <TopLaboratoriesChart 
                segments={selectedSegment ? [selectedSegment] : searchResults} 
              />
            </SectionContainer>
          )}
          
          {/* Top Produits */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="products" 
              title="Top Produits"
              subtitle={selectedSegment 
                ? `Produits les plus vendus de ${selectedSegment.name}`
                : "Produits les plus vendus par segment"}
              icon={<FiPackage />}
            >
              <span>Top Produits</span>
              {/* <TopProductsTable 
                segments={selectedSegment ? [selectedSegment] : searchResults} 
              /> */}
            </SectionContainer>
          )}
          
          {/* Tableau des segments */}
          {searchResults.length > 0 && !selectedSegment && (
            <SectionContainer 
              id="segments" 
              title="Segments détaillés"
              subtitle={`Liste complète des ${segmentType}`}
              icon={<FiGrid />}
            >
              <MarketSegmentTable 
                segments={searchResults} 
                onSegmentSelect={handleSegmentSelect}
              />
            </SectionContainer>
          )}
          
          {/* Message si aucun résultat */}
          {searchResults.length === 0 && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 text-center">
                Utilisez la barre de recherche pour explorer les segments de marché
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}