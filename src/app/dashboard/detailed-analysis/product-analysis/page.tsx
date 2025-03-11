'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { ProductResultTable, Product } from '@/components/dashboard/products/ProductResultTable';
import { ProductSearchStats } from '@/components/dashboard/products/ProductSearchStats';
import { SearchHelp } from '@/components/dashboard/analysis/SearchHelp';
import { createUrlWithCurrentDateParams } from '@/utils/navigationUtils';
import { ProductSearch } from '@/components/dashboard/products/ProductSearch';
import { ProductsAggregateCharts } from '@/components/dashboard/products/ProductsAggregateCharts';

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
  }
];

/**
 * Page d'analyse détaillée par produit
 */
export default function ProductAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Product[]>([]);

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
          title="Analyse par Produit"
          subtitle="Recherchez et analysez les données spécifiques par produit"
        />
        
        {/* Guide d'aide à la recherche */}
        <SearchHelp />
        
        {/* Formulaire de recherche */}
        <ProductSearch onSearch={handleSearch} />
        
        {/* Statistiques des résultats */}
        {searchResults.length > 0 && <ProductSearchStats products={searchResults} />}

        {searchResults.length > 0 && <ProductsAggregateCharts products={searchResults} />}
        
        {/* Tableau des résultats */}
        <ProductResultTable products={searchResults} />
      </div>
    </div>
  );
}