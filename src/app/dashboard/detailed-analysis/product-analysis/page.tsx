'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiBarChart2, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import { ProductResultTable, Product } from '@/components/dashboard/products/ProductResultTable';
import { ProductSearchStats } from '@/components/dashboard/products/ProductSearchStats';
import { SearchHelp } from '@/components/dashboard/analysis/SearchHelp';
import { createUrlWithCurrentDateParams } from '@/utils/navigationUtils';
import { ProductsAggregateCharts } from '@/components/dashboard/products/ProductsAggregateCharts';
import { GlobalComparisonChart } from '@/components/dashboard/products/comparison/GlobalComparisonChart';
import { filterProducts } from '@/utils/filterUtils';
import { SalesDistributionSection } from '@/components/dashboard/products/distribution/SalesDistributionSection';
import { mockProductData } from '@/utils/mockProductData';
import { PharmacyResultTable } from '@/components/dashboard/products/PharmacyResultTable';
import { mockPharmacyData } from '@/utils/mockPharmacyData';
import { StickyHeaderNav } from '@/components/dashboard/products/StickyHeaderNav';
import { SectionContainer } from '@/components/ui/SectionContainer';

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
  const [activeSection, setActiveSection] = useState('overview');

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

  // Effet pour surveiller le défilement et mettre à jour la section active
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview', 'analytics', 'comparison', 'distribution', 'pharmacies', 'results'
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
        
        {/* Header sticky avec la recherche ou le filtre actif */}
        <StickyHeaderNav 
          onSearch={handleSearch}
          activeFilter={activeFilter}
          filterTitle={filterTitle}
          clearFilter={clearFilter}
          showNavigation={filteredResults.length > 0}
          activeSection={activeSection}
        />
        
        {/* Contenu principal avec effet de padding pour éviter que le contenu soit caché derrière le header sticky */}
        <div className="pt-4">
          {/* Guide d'aide à la recherche */}
          {!activeFilter && <SearchHelp />}
          
          {/* Aperçu des résultats */}
          <div id="overview">
            {filteredResults.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aperçu des résultats</h2>
                <ProductSearchStats products={filteredResults} />
              </div>
            )}
          </div>
          
          {/* Graphiques analytiques */}
          <div id="analytics">
            {filteredResults.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FiBarChart2 size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analyses approfondies</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tendances de ventes et niveaux de stock</p>
                  </div>
                </div>
                <ProductsAggregateCharts products={filteredResults} />
              </div>
            )}
          </div>
          
          {/* Graphique de comparaison avec le groupement */}
          <div id="comparison">
            {showComparison && filteredResults.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FiTrendingUp size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Comparaison avec le groupement</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Performance relative par rapport aux moyennes du marché</p>
                  </div>
                </div>
                <GlobalComparisonChart products={filteredResults} />
              </div>
            )}
          </div>

          {/* Section de répartition des ventes */}
          <div id="distribution">
            {filteredResults.length === 1 && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FiPieChart size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Répartition des ventes</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Distribution des ventes par catégorie et période</p>
                  </div>
                </div>
                <SalesDistributionSection product={filteredResults[0]} />
              </div>
            )}
          </div>

          {/* Section des pharmacies */}
          <div id="pharmacies">
            {showPharmacies && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FiUsers size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pharmacies distribuant ces produits</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{mockPharmacyData.length} pharmacies trouvées</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Consultez la liste des pharmacies qui distribuent les produits sélectionnés et leurs performances associées.
                  </p>
                </div>
                <PharmacyResultTable pharmacies={mockPharmacyData} />
              </div>
            )}
          </div>
          
          {/* Tableau des résultats */}
          <div id="results">
            {filteredResults.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Résultats détaillés</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Données complètes pour les produits sélectionnés</p>
                <ProductResultTable products={filteredResults} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}