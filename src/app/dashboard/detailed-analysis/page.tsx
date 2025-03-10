'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft, FiBox, FiPackage, FiGrid, FiSearch, FiBarChart, FiTrendingUp } from 'react-icons/fi';
import { AnalysisCategoryCard } from '@/components/dashboard/analysis/AnalysisCategoryCard';
import { StatisticsSection } from '@/components/dashboard/analysis/StatisticsSection';

/**
 * Page d'analyse détaillée
 * 
 * Cette page sert de hub pour l'exploration détaillée des données par produit,
 * laboratoire ou marché.
 */
export default function DetailedAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Données simulées pour les tops 3
  const topProducts = [
    { name: 'Doliprane 1000mg', value: '342 ventes', change: '+8.4%' },
    { name: 'Efferalgan 500mg', value: '285 ventes', change: '+4.2%' },
    { name: 'Amoxicilline Biogaran', value: '210 ventes', change: '+12.8%' },
  ];

  const topLabs = [
    { name: 'Sanofi', value: '1245 ventes', change: '+3.2%' },
    { name: 'Pfizer', value: '986 ventes', change: '+1.8%' },
    { name: 'Biogaran', value: '854 ventes', change: '-2.1%' },
  ];

  const topMarkets = [
    { name: 'Douleur & Fièvre', value: '2450 ventes', change: '+5.7%' },
    { name: 'Vitamines', value: '1320 ventes', change: '+9.8%' },
    { name: 'Antibiotiques', value: '965 ventes', change: '-1.2%' },
  ];

  const globalStats = [
    { label: 'Produits analysés', value: '3,842' },
    { label: 'Laboratoires', value: '164' },
    { label: 'Marchés', value: '42' },
    { label: 'Analyses effectuées', value: '1,293' },
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
          title="Analyse Détaillée"
          subtitle="Explorez les données spécifiques par produit, laboratoire ou marché"
        />
        
        {/* Contenu de la page avec carte d'analyse */}
        <div className="grid md:grid-cols-3 gap-6">
          <AnalysisCategoryCard
            title="Par produit"
            description="Analysez les performances de chaque produit individuellement avec des recherches par code EAN13 ou nom."
            icon={<FiBox size={22} />}
            buttonIcon={<FiSearch className="mr-2" size={16} />}
            buttonText="Rechercher un produit"
            linkPath="/dashboard/detailed-analysis/product-analysis"
            topItems={topProducts}
            topTitle="Top 3 Produits"
            bgColorClass="bg-blue-100 dark:bg-blue-900/30"
            textColorClass="text-blue-600 dark:text-blue-300"
          />
          
          <AnalysisCategoryCard
            title="Par laboratoire"
            description="Évaluez les performances par fabricant ou laboratoire pour identifier les partenaires stratégiques."
            icon={<FiPackage size={22} />}
            buttonIcon={<FiBarChart className="mr-2" size={16} />}
            buttonText="Explorer les laboratoires"
            linkPath="/dashboard/detailed-analysis/lab-analysis"
            topItems={topLabs}
            topTitle="Top 3 Laboratoires"
            bgColorClass="bg-purple-100 dark:bg-purple-900/30"
            textColorClass="text-purple-600 dark:text-purple-300"
          />
          
          <AnalysisCategoryCard
            title="Par marché"
            description="Analysez les tendances et performances par segment de marché ou catégorie thérapeutique pour optimiser votre offre commerciale."
            icon={<FiGrid size={22} />}
            buttonIcon={<FiTrendingUp className="mr-2" size={16} />}
            buttonText="Analyser les marchés"
            linkPath="/dashboard/detailed-analysis/market-analysis"
            topItems={topMarkets}
            topTitle="Top 3 Marchés"
            bgColorClass="bg-green-100 dark:bg-green-900/30"
            textColorClass="text-green-600 dark:text-green-300"
          />
        </div>
        
        <StatisticsSection
          title="Statistiques globales d'analyse"
          stats={globalStats}
        />
      </div>
    </div>
  );
}