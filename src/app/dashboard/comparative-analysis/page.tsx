'use client';

import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

// Composant principal séparé
function ComparativeAnalysisContent() {
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
          title="Analyse Comparative"
          subtitle="Comparez les performances entre différents acteurs ou produits"
        />
        
        {/* Contenu de la page (placeholder) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-gray-700 dark:text-gray-300">
            Cette page permettra de comparer les performances entre différents éléments
            (produits, laboratoires, périodes). Intégrez ici vos outils de comparaison et graphiques.
          </p>
          
          <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Sélectionner les éléments à comparer</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Premier élément
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Sélectionner un élément</option>
                  <option>Doliprane 1000mg</option>
                  <option>Efferalgan 500mg</option>
                  <option>Sanofi (Laboratoire)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Second élément
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Sélectionner un élément</option>
                  <option>Doliprane 1000mg</option>
                  <option>Efferalgan 500mg</option>
                  <option>Sanofi (Laboratoire)</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Comparer
              </button>
            </div>
          </div>
          
          {/* Placeholder pour le graphique de comparaison */}
          <div className="mt-6 h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Le graphique de comparaison s&apos;affichera ici après la sélection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant page enveloppé dans Suspense
export default function ComparativeAnalysisPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Chargement...</div>}>
      <ComparativeAnalysisContent />
    </Suspense>
  );
}