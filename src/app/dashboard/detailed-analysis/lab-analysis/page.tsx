'use client';

import { LabMarginSummary } from '@/components/dashboard/labs/LabMarginSummary';
import { LabSalesTrendSummary } from '@/components/dashboard/labs/LabSalesTrendSummary';
import { LabComparisonChart } from '@/components/dashboard/labs/LabComparisonChart';
import { LabSegmentVisualization } from '@/components/dashboard/labs/LabSegmentVisualization';
import { LabAnnualForecast } from '@/components/dashboard/labs/forecast/LabAnnualForecast';
import { LabTargetTracking } from '@/components/dashboard/labs/forecast/LabTargetTracking';
import { generateMockLabResults } from '@/utils/labUtils';
import { mockProductData } from '@/utils/mockProductData';
import { PharmacyResultTable } from '@/components/dashboard/products/PharmacyResultTable';
import { mockPharmacyData } from '@/utils/mockPharmacyData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LabSalesChart } from '@/components/dashboard/charts/LabSalesChart';
import { LabStockChart } from '@/components/dashboard/charts/LabStockChart';
import { Laboratory, LabResultTable } from '@/components/dashboard/labs/LabResultTable';
import { LabSearchStats } from '@/components/dashboard/labs/LabSearchStats';
import { LabStockSummary } from '@/components/dashboard/labs/LabStockSummary';
import { LabTopProducts } from '@/components/dashboard/labs/LabTopProducts';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { StickyHeaderNav } from '@/components/dashboard/labs/StickyHeaderNav';
import { useDateRange } from '@/providers/DateRangeProvider';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrendingUp, FiPackage, FiUsers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

/**
 * Page d'analyse détaillée par laboratoire
 */
export default function LabAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Laboratory[]>([]);
  const { startDate, endDate } = useDateRange();
  const [activeSection, setActiveSection] = useState('overview');

  // Effet pour surveiller le défilement et mettre à jour la section active
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview', 'sales', 'stocks', 'summaries', 
        'comparison', 'segments', 'forecast', 'targets', 
        'pharmacies', 'results'
      ];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Ajusté pour prendre en compte la hauteur du header sticky
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

  // Effectuer la recherche
  const handleSearch = (labs: Laboratory[]) => {
    // Soit les laboratoires sélectionnés, soit tous les laboratoires si aucune sélection
    setSearchResults(labs.length > 0 ? labs : generateMockLabResults(''));
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
            href="/dashboard/detailed-analysis" 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiArrowLeft className="mr-2" /> Retour à l'analyse détaillée
          </Link>
        </div>
        
        <DashboardHeader 
          title="Analyse par Laboratoire"
          subtitle="Explorez les performances par fabricant ou laboratoire"
        />
        
        {/* Header sticky avec la recherche et la navigation */}
        <StickyHeaderNav 
          onSearch={handleSearch}
          showNavigation={searchResults.length > 0}
          activeSection={activeSection}
        />
        
        {/* Contenu principal avec effet de padding pour éviter que le contenu soit caché derrière le header sticky */}
        <div className="pt-4">
          {/* Statistiques de recherche */}
          {searchResults.length > 0 && (
            <SectionContainer id="overview" title="Aperçu des résultats">
              <LabSearchStats laboratories={searchResults} />
            </SectionContainer>
          )}
          
          {/* Graphique des ventes de laboratoires */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="sales" 
              title="Évolution des ventes" 
              subtitle="Analyse des tendances de ventes sur la période sélectionnée"
              icon={<FiTrendingUp />}
            >
              <LabSalesChart 
                laboratories={searchResults} 
                startDate={startDate} 
                endDate={endDate} 
              />
            </SectionContainer>
          )}

          {/* Graphique des stocks de laboratoires */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="stocks" 
              title="Gestion des stocks" 
              subtitle="Suivi des niveaux de stock et détection des ruptures"
              icon={<FiPackage />}
            >
              <LabStockChart 
                laboratories={searchResults} 
                startDate={startDate} 
                endDate={endDate} 
              />
            </SectionContainer>
          )}

          {/* Synthèses et analyses */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="summaries" 
              title="Synthèses et analyses" 
              subtitle="Indicateurs clés par catégorie"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <LabTopProducts 
                  laboratories={searchResults} 
                  allProducts={mockProductData} 
                />
                <LabStockSummary 
                  laboratories={searchResults} 
                  allProducts={mockProductData} 
                />
                <LabMarginSummary 
                  laboratories={searchResults} 
                  allProducts={mockProductData} 
                />
                <LabSalesTrendSummary 
                  laboratories={searchResults} 
                  allProducts={mockProductData} 
                />
              </div>
            </SectionContainer>
          )}

          {/* Comparaison avec le groupement */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="comparison" 
              title="Comparaison avec le groupement" 
              subtitle="Performance relative par rapport aux moyennes du marché"
            >
              <LabComparisonChart 
                laboratories={searchResults} 
                allProducts={mockProductData} 
              />
            </SectionContainer>
          )}

          {/* Visualisation par segments */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="segments" 
              title="Analyse par segments" 
              subtitle="Répartition des ventes par catégorie et famille de produits"
            >
              <LabSegmentVisualization 
                laboratories={searchResults} 
                allProducts={mockProductData} 
              />
            </SectionContainer>
          )}

          {/* Prévisions annuelles */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="forecast" 
              title="Prévisions annuelles" 
              subtitle="Projections basées sur les tendances historiques"
            >
              <LabAnnualForecast laboratories={searchResults} />
            </SectionContainer>
          )}

          {/* Suivi des objectifs */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="targets" 
              title="Suivi des objectifs" 
              subtitle="Progression vers les objectifs commerciaux"
            >
              <LabTargetTracking laboratories={searchResults} />
            </SectionContainer>
          )}

          {/* Pharmacies distribuant les produits */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="pharmacies" 
              title="Pharmacies distribuant ces produits" 
              subtitle={`${mockPharmacyData.length} pharmacies trouvées`}
              icon={<FiUsers />}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Consultez la liste des pharmacies qui distribuent les produits sélectionnés et leurs performances associées.
                </p>
              </div>
              <PharmacyResultTable pharmacies={mockPharmacyData} />
            </SectionContainer>
          )}
          
          {/* Tableau des résultats */}
          {searchResults.length > 0 && (
            <SectionContainer 
              id="results" 
              title="Résultats détaillés" 
              subtitle="Données complètes pour les laboratoires sélectionnés"
            >
              <LabResultTable laboratories={searchResults} />
            </SectionContainer>
          )}
          
          {/* Placeholder si aucun résultat */}
          {searchResults.length === 0 && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 text-center">
                Utilisez la barre de recherche ci-dessus pour trouver des laboratoires.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}