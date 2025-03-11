'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { LabSearch } from '@/components/dashboard/labs/LabSearch';
import { LabResultTable } from '@/components/dashboard/labs/LabResultTable';
import { LabSearchStats } from '@/components/dashboard/labs/LabSearchStats';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';

/**
 * Page d'analyse détaillée par laboratoire
 */
export default function LabAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Laboratory[]>([]);

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Simuler une recherche avec nos données de test
  const handleSearch = (results: any[]) => {
    // Dans une vraie application, ce serait un appel API réel
    // Ici, on utilise directement les résultats du mock de la fonction de recherche
    setSearchResults(results);
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
        
        {/* Tableau des résultats */}
        {searchResults.length > 0 && (
          <LabResultTable laboratories={searchResults} />
        )}
        
        {/* Placeholder si aucun résultat */}
        {searchResults.length === 0 && (
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Utilisez la barre de recherche ci-dessus pour trouver des laboratoires par nom.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}