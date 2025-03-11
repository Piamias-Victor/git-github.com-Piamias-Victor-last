'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';
import { ProductResultTable, Product } from '@/components/dashboard/products/ProductResultTable';
import { ProductSearchStats } from '@/components/dashboard/products/ProductSearchStats';
import { SearchHelp } from '@/components/dashboard/analysis/SearchHelp';
import { createUrlWithCurrentDateParams } from '@/utils/navigationUtils';
import { ProductSearch } from '@/components/dashboard/products/ProductSearch';
import { ProductsAggregateCharts } from '@/components/dashboard/products/ProductsAggregateCharts';
import { filterProducts } from '@/utils/filterUtils';

// Données de test pour démonstration
const mockProductData: Product[] = [
  {
    id: '1',
    ean: '3400936152786',
    name: 'Doliprane 1000mg Boîte de 8 comprimés',
    laboratory: 'Sanofi',
    category: 'Douleur & Fièvre',
    stock: 42,
    price: '2.18',
    margin: '0.84',
    marginRate: '38.5%',
    sales: 126
  },
  {
    id: '2',
    ean: '3400935955838',
    name: 'Efferalgan 500mg 16 comprimés effervescents',
    laboratory: 'UPSA',
    category: 'Douleur & Fièvre',
    stock: 18,
    price: '2.65',
    margin: '0.92',
    marginRate: '34.7%',
    sales: 87
  },
  {
    id: '3',
    ean: '3400930025567',
    name: 'Advil 200mg Boîte de 20 comprimés',
    laboratory: 'Pfizer',
    category: 'Anti-inflammatoires',
    stock: 7,
    price: '3.95',
    margin: '1.32',
    marginRate: '33.4%',
    sales: 54
  },
  {
    id: '4',
    ean: '3400937438483',
    name: 'Amoxicilline Biogaran 500mg Boîte de 12 gélules',
    laboratory: 'Biogaran',
    category: 'Antibiotiques',
    stock: 3,
    price: '6.50',
    margin: '1.85',
    marginRate: '28.5%',
    sales: 32
  },
  {
    id: '5',
    ean: '3400930082676',
    name: 'Smecta 3g Poudre pour suspension buvable 30 sachets',
    laboratory: 'Ipsen',
    category: 'Digestion',
    stock: 15,
    price: '5.75',
    margin: '1.42',
    marginRate: '24.7%',
    sales: 41
  },
  {
    id: '6',
    ean: '3400938208733',
    name: 'Voltarène Emulgel 1% 100g',
    laboratory: 'Novartis',
    category: 'Anti-inflammatoires',
    stock: 24,
    price: '8.90',
    margin: '2.65',
    marginRate: '29.8%',
    sales: 37
  },
  {
    id: '7',
    ean: '3400937851572',
    name: 'Imodium 2mg Boîte de 20 gélules',
    laboratory: 'Janssen',
    category: 'Digestion',
    stock: 12,
    price: '4.85',
    margin: '1.52',
    marginRate: '31.3%',
    sales: 28
  },
  {
    id: '8',
    ean: '3400938101379',
    name: 'Magné B6 Boîte de 60 comprimés',
    laboratory: 'Sanofi',
    category: 'Compléments alimentaires',
    stock: 4,
    price: '9.75',
    margin: '3.12',
    marginRate: '32.0%',
    sales: 18
  },
  {
    id: '9',
    ean: '3400930085745',
    name: 'Daflon 500mg Boîte de 30 comprimés',
    laboratory: 'Servier',
    category: 'Circulation',
    stock: 2,
    price: '10.95',
    margin: '-0.50',
    marginRate: '-4.6%',
    sales: 49
  },
  {
    id: '10',
    ean: '3400937025423',
    name: 'Nurofen 400mg Boîte de 12 capsules',
    laboratory: 'Reckitt Benckiser',
    category: 'Anti-inflammatoires',
    stock: 67,
    price: '4.25',
    margin: '1.05',
    marginRate: '24.7%',
    sales: 15
  },
];

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
        
        {/* Tableau des résultats */}
        <ProductResultTable products={filteredResults} />
      </div>
    </div>
  );
}