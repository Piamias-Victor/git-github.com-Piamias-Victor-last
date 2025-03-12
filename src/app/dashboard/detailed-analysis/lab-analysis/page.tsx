'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft, FiUsers } from 'react-icons/fi';
import { LabSearch } from '@/components/dashboard/labs/LabSearch';
import { LabResultTable } from '@/components/dashboard/labs/LabResultTable';
import { LabSearchStats } from '@/components/dashboard/labs/LabSearchStats';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';
import { LabSalesChart } from '@/components/dashboard/charts/LabSalesChart';
import { useDateRange } from '@/providers/DateRangeProvider';
import { LabStockChart } from '@/components/dashboard/charts/LabStockChart';
import { LabTopProducts } from '@/components/dashboard/labs/LabTopProducts';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LabStockSummary } from '@/components/dashboard/labs/LabStockSummary';
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

/**
 * Page d'analyse détaillée par laboratoire
 */
export default function LabAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Laboratory[]>([]);
  const { startDate, endDate } = useDateRange();

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
        
        {/* Composant de recherche de laboratoires */}
        <LabSearch onSearch={handleSearch} />
        
        {/* Statistiques de recherche */}
        {searchResults.length > 0 && (
          <LabSearchStats laboratories={searchResults} />
        )}
        
        {/* Graphique des ventes de laboratoires */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <LabSalesChart 
              laboratories={searchResults} 
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6">
            <LabStockChart 
              laboratories={searchResults} 
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
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
        )}

        {searchResults.length > 0 && (
          <LabComparisonChart 
            laboratories={searchResults} 
            allProducts={mockProductData} 
          />
        )}

        {searchResults.length > 0 && (
          <LabSegmentVisualization 
            laboratories={searchResults} 
            allProducts={mockProductData} 
          />
        )}

        {searchResults.length > 0 && (
          <LabAnnualForecast laboratories={searchResults} />
        )}

        {searchResults.length > 0 && (
          <LabTargetTracking laboratories={searchResults} />
        )}

         {searchResults.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiUsers className="mr-2" /> 
                          Pharmacies distribuant ces produits
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {mockPharmacyData.length} pharmacies trouvées
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Consultez la liste des pharmacies qui distribuent les produits sélectionnés et leurs performances associées.
                      </p>
                    </div>
                    <PharmacyResultTable pharmacies={mockPharmacyData} />
                  </div>
                )}
        
        {/* Tableau des résultats */}
        {searchResults.length > 0 && (
          <LabResultTable laboratories={searchResults} />
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
  );
}