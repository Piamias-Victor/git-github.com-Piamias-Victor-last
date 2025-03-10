'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * Page d'analyse détaillée par laboratoire
 */
export default function LabAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
        
        {/* Contenu de la page (placeholder) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-gray-700 dark:text-gray-300">
            Cette page permet d'analyser les performances par laboratoire. Dans une application complète, 
            vous pourriez implémenter ici une recherche de laboratoires, des filtres et des visualisations spécifiques.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Fonctionnalités à implémenter
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Recherche de laboratoires par nom</li>
              <li>Filtre par volume de ventes</li>
              <li>Comparaison de performances entre laboratoires</li>
              <li>Analyse des marges par laboratoire</li>
              <li>Évolution des ventes sur différentes périodes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}