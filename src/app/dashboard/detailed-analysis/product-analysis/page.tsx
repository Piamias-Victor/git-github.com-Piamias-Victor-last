'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { ProductSearch } from '@/components/dashboard/analysis/ProductSearch';
import { ProductResultTable } from '@/components/dashboard/analysis/ProductResultTable';
import { SearchHelp } from '@/components/dashboard/analysis/SearchHelp';
import { createUrlWithCurrentDateParams } from '@/utils/navigationUtils';

/**
 * Page d'analyse détaillée par produit
 */
export default function ProductAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

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
        <ProductSearch onSearch={setSearchResults} />
        
        {/* Tableau des résultats */}
        <ProductResultTable products={searchResults} />
      </div>
    </div>
  );
}