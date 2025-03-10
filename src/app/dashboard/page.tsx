'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FiBarChart, FiPackage, FiPieChart, FiUsers } from 'react-icons/fi';

// Composant statistique simple pour le dashboard
function StatCard({ title, value, icon, colorClass }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-full p-3 ${colorClass}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
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
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bonjour, {session.user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Bienvenue sur le tableau de bord de {session.user?.pharmacyName}
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Chiffre d'affaires"
            value="12 580 €"
            icon={<FiBarChart size={24} />}
            colorClass="bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300"
          />
          <StatCard
            title="Produits actifs"
            value="4 328"
            icon={<FiPackage size={24} />}
            colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
          />
          <StatCard
            title="Marge moyenne"
            value="31.4%"
            icon={<FiPieChart size={24} />}
            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
          />
          <StatCard
            title="Clients fidèles"
            value="843"
            icon={<FiUsers size={24} />}
            colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
          />
        </div>

        {/* Contenu principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Récapitulatif des données
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Cette section contiendra les tableaux de bord et graphiques d'analyse.
            Le contenu réel sera développé selon les spécifications détaillées du projet.
          </p>
        </div>
      </div>
    </div>
  );
}