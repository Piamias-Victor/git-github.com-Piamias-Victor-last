'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiAlertTriangle, 
  FiPackage, 
  FiActivity, 
  FiDatabase,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
  FiShoppingCart
} from 'react-icons/fi';

// Définition du type pour les actions
interface ActionCardProps {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  linkPath: string;
  priority: 'high' | 'medium' | 'low';
}

// Composant pour une carte d'action
function ActionCard({ title, description, count, icon, linkPath, priority }: ActionCardProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  };

  return (
    <Link href={linkPath} className="block">
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              {icon}
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
              {priority === 'high' ? 'Prioritaire' : priority === 'medium' ? 'Moyen' : 'Faible'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {count} éléments
            </span>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Résoudre &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Page de vue d'ensemble des actions à mener
 */
export default function ActionsOverviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Données pour les cartes d'action
  const actionCards: ActionCardProps[] = [
    {
      title: "Marges négatives",
      description: "Produits dont le prix de vente est inférieur au prix de revient",
      count: 23,
      icon: <FiAlertTriangle size={20} className="text-red-600 dark:text-red-400" />,
      linkPath: "/dashboard/actions/negative-margins",
      priority: "high"
    },
    {
      title: "Ruptures de stock",
      description: "Produits en rupture nécessitant un réapprovisionnement",
      count: 15,
      icon: <FiDatabase size={20} className="text-amber-600 dark:text-amber-400" />,
      linkPath: "/dashboard/actions/stockouts",
      priority: "high"
    },
    {
      title: "Surstock",
      description: "Produits avec un stock supérieur à 3 mois de ventes",
      count: 42,
      icon: <FiPackage size={20} className="text-blue-600 dark:text-blue-400" />,
      linkPath: "/dashboard/actions/overstock",
      priority: "medium"
    },
    {
      title: "Faible rotation",
      description: "Produits ayant une rotation inférieure à 3 ventes par mois",
      count: 67,
      icon: <FiActivity size={20} className="text-purple-600 dark:text-purple-400" />,
      linkPath: "/dashboard/actions/slow-moving",
      priority: "medium"
    },
    {
      title: "Produits en baisse",
      description: "Produits dont les ventes ont diminué de plus de 20% sur 3 mois",
      count: 18,
      icon: <FiTrendingDown size={20} className="text-indigo-600 dark:text-indigo-400" />,
      linkPath: "/dashboard/actions/declining",
      priority: "low"
    },
    {
      title: "Opportunités tarifaires",
      description: "Produits dont le prix est significativement inférieur à la moyenne du marché",
      count: 9,
      icon: <FiDollarSign size={20} className="text-emerald-600 dark:text-emerald-400" />,
      linkPath: "/dashboard/actions/pricing",
      priority: "low"
    },
    {
      title: "Optimisation catégories",
      description: "Catégories nécessitant une révision de la structure ou des marges",
      count: 4,
      icon: <FiPieChart size={20} className="text-sky-600 dark:text-sky-400" />,
      linkPath: "/dashboard/actions/categories",
      priority: "low"
    },
    {
      title: "Produits complémentaires",
      description: "Suggestions de produits complémentaires pour augmenter le panier moyen",
      count: 31,
      icon: <FiShoppingCart size={20} className="text-amber-600 dark:text-amber-400" />,
      linkPath: "/dashboard/actions/cross-selling",
      priority: "medium"
    }
  ];

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
          title="Actions à mener"
          subtitle="Vue d'ensemble des actions recommandées pour optimiser vos performances"
        />
        
        {/* Statistiques globales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Actions totales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">209</p>
            </div>
            <div className="text-center p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Prioritaires</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">38</p>
            </div>
            <div className="text-center p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Moyennes</p>
              <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">140</p>
            </div>
            <div className="text-center p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Faibles</p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">31</p>
            </div>
          </div>
        </div>
        
        {/* Grille des cartes d'action */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {actionCards.map((action, index) => (
            <ActionCard 
              key={index}
              title={action.title}
              description={action.description}
              count={action.count}
              icon={action.icon}
              linkPath={action.linkPath}
              priority={action.priority}
            />
          ))}
        </div>
      </div>
    </div>
  );
}