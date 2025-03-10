'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * Page d'analyse détaillée par marché
 */
export default function MarketAnalysisPage() {
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
          title="Analyse par Marché"
          subtitle="Explorez les tendances par segment de marché ou catégorie"
        />
        
        {/* Contenu de la page (placeholder) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-gray-700 dark:text-gray-300">
            Cette page permet d'analyser les tendances par segment de marché ou catégorie. Dans une application complète, 
            vous pourriez implémenter ici une sélection de marchés, des graphiques de tendances et des rapports détaillés.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Segments de marché analysables
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">Douleur & Fièvre</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">42 produits</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">Vitamines</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">38 produits</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">Antibiotiques</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">24 produits</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">Dermatologie</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">56 produits</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">Digestion</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">32 produits</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">Sommeil</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">18 produits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}