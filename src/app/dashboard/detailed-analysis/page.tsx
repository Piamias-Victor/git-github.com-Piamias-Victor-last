'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * Page d'analyse détaillée
 * 
 * Cette page servira à l'exploration détaillée des données par produit,
 * laboratoire ou marché.
 */
export default function DetailedAnalysisPage() {
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
            href="/dashboard" 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiArrowLeft className="mr-2" /> Retour au tableau de bord
          </Link>
        </div>
        
        <DashboardHeader 
          title="Analyse Détaillée"
          subtitle="Explorez les données spécifiques par produit, laboratoire ou marché"
        />
        
        {/* Contenu de la page (placeholder) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-gray-700 dark:text-gray-300">
            Cette page permettra d'explorer en détail les performances par produit, 
            par laboratoire ou par marché. Implémentez ici vos filtres, tableaux de données
            et visualisations spécifiques.
          </p>
          
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Par produit</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analysez les performances de chaque produit individuellement.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Par laboratoire</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Évaluez les performances par fabricant ou laboratoire.
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Par marché</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analysez les tendances par segment de marché ou catégorie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}