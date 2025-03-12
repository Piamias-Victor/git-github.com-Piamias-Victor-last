'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft, FiFilter, FiUsers } from 'react-icons/fi';
import { ProductResultTable, Product } from '@/components/dashboard/products/ProductResultTable';
import { ProductSearchStats } from '@/components/dashboard/products/ProductSearchStats';
import { SearchHelp } from '@/components/dashboard/analysis/SearchHelp';
import { createUrlWithCurrentDateParams } from '@/utils/navigationUtils';
import { ProductSearch } from '@/components/dashboard/products/ProductSearch';
import { ProductsAggregateCharts } from '@/components/dashboard/products/ProductsAggregateCharts';
import { GlobalComparisonChart } from '@/components/dashboard/products/comparison/GlobalComparisonChart';
import { filterProducts } from '@/utils/filterUtils';
import { SalesDistributionSection } from '@/components/dashboard/products/distribution/SalesDistributionSection';
import { mockProductData } from '@/utils/mockProductData';
import { PharmacyResultTable } from '@/components/dashboard/products/PharmacyResultTable';
import { mockPharmacyData } from '@/utils/mockPharmacyData';


/**
 * Page d'analyse détaillée par produit
 */
export default function ProductAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<{type: string, value: string} | null>(null);
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [showPharmacies, setShowPharmacies] = useState<boolean>(false);

  // Récupérer les filtres depuis l'URL
  useEffect(() => {
    const filterType = searchParams?.get('filter');
    const filterValue = searchParams?.get('value');
    
    if (filterType && filterValue) {
      setActiveFilter({ type: filterType, value: filterValue });
      
      // Définir le titre du filtre
      let title = 'Produits filtrés';
      switch (filterType) {
        case 'stock':
          switch (filterValue) {
            case 'critical': title = 'Produits en stock critique'; break;
            case 'watch': title = 'Produits à surveiller'; break;
            case 'optimal': title = 'Produits avec stock optimal'; break;
            case 'over': title = 'Produits en surstock'; break;
          }
          break;
        case 'margin':
          switch (filterValue) {
            case 'negative': title = 'Produits à marge négative'; break;
            case 'low': title = 'Produits à faible marge'; break;
            case 'good': title = 'Produits à bonne marge'; break;
            case 'excellent': title = 'Produits à excellente marge'; break;
          }
          break;
        case 'trend':
          switch (filterValue) {
            case 'high-decline': title = 'Produits en forte baisse'; break;
            case 'low-decline': title = 'Produits en légère baisse'; break;
            case 'stable': title = 'Produits stables'; break;
            case 'low-growth': title = 'Produits en légère hausse'; break;
            case 'high-growth': title = 'Produits en forte hausse'; break;
          }
          break;
      }
      setFilterTitle(title);
      
      // Appliquer automatiquement la recherche avec filtre
      setSearchResults(mockProductData);
    }
  }, [searchParams]);

  // Appliquer le filtre lorsque les résultats de recherche ou le filtre actif changent
  useEffect(() => {
    if (searchResults.length > 0 && activeFilter) {
      const filtered = filterProducts(searchResults, activeFilter.type, activeFilter.value);
      setFilteredResults(filtered);
    } else {
      setFilteredResults(searchResults);
    }
  }, [searchResults, activeFilter]);

  // Activer la comparaison lorsque nous avons des résultats
  useEffect(() => {
    if (filteredResults.length > 0) {
      // On pourrait définir un seuil minimum pour afficher la comparaison
      setShowComparison(filteredResults.length >= 3);
      
      // Afficher les pharmacies si nous avons des résultats
      setShowPharmacies(true);
    } else {
      setShowComparison(false);
      setShowPharmacies(false);
    }
  }, [filteredResults]);

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Simuler une recherche avec nos données de test
  const handleSearch = (results: any[]) => {
    // Si l'utilisateur a fait une vraie recherche, on pourrait filtrer nos données de test
    // En production, cela serait remplacé par un appel API réel
    setSearchResults(mockProductData);
  };

  // Effacer le filtre actif
  const clearFilter = () => {
    setActiveFilter(null);
    setFilterTitle('');
    setFilteredResults(searchResults);
    
    // Mettre à jour l'URL sans les paramètres de filtre
    const baseUrl = window.location.pathname;
    const url = createUrlWithCurrentDateParams(baseUrl);
    router.push(url);
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
          title={activeFilter ? filterTitle : "Analyse par Produit"}
          subtitle={activeFilter 
            ? `${filteredResults.length} produits correspondants à votre filtre`
            : "Recherchez et analysez les données spécifiques par produit"
          }
        />
        
        {/* Filtre actif */}
        {activeFilter && (
          <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FiFilter className="text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-indigo-700 dark:text-indigo-300">
                  Filtre actif: {filterTitle}
                </span>
              </div>
              <button 
                onClick={clearFilter}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Effacer le filtre
              </button>
            </div>
          </div>
        )}
        
        {/* Guide d'aide à la recherche */}
        {!activeFilter && <SearchHelp />}
        
        {/* Formulaire de recherche */}
        {!activeFilter && <ProductSearch onSearch={handleSearch} />}
        
        {/* Statistiques des résultats */}
        {filteredResults.length > 0 && <ProductSearchStats products={filteredResults} />}
        
        {/* Graphiques agrégés */}
        {filteredResults.length > 0 && <ProductsAggregateCharts products={filteredResults} />}
        
        {/* Graphique de comparaison avec le groupement */}
        {showComparison && filteredResults.length > 0 && (
          <GlobalComparisonChart products={filteredResults} />
        )}

        {/* Section des pharmacies */}
        {showPharmacies && (
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

        {/* Ajouter la section de répartition des ventes si nous avons des résultats */}
        {filteredResults.length === 1 && (
          <SalesDistributionSection product={filteredResults[0]} />
        )}
        
        {/* Tableau des résultats */}
        <ProductResultTable products={filteredResults} />
      </div>
    </div>
  );
}