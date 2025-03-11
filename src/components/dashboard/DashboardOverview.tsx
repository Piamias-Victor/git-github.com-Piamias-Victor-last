'use client';

import { useSession } from "next-auth/react";
import { ActionItems } from "./ActionItems";
import { DashboardHeader } from "./DashboardHeader";
import { NavigationCards } from "./NavigationCards";
import { GlobalSummary } from "./stats/GlobalSummary";
import { StatCards } from "./stats/StatCards";



/**
 * DashboardOverview Component
 * 
 * Page principale du tableau de bord qui sert de menu et présente
 * un aperçu des statistiques clés.
 */
export function DashboardOverview() {
  const { data: session } = useSession();
  
  // Données de navigation pour les analyses détaillées et comparatives
  const navigationData = [
    {
      title: "Analyse Détaillée",
      description: "Explorez les données spécifiques par produit, laboratoire ou marché",
      linkPath: "/dashboard/detailed-analysis",
      icon: "chart"
    },
    {
      title: "Analyse Comparative", 
      description: "Comparez les performances entre différents acteurs ou produits",
      linkPath: "/dashboard/comparative-analysis",
      icon: "compare"
    }
  ];
  
  // Données pour les cartes statistiques
  const statsData = [
    { title: "Chiffre d'affaires", value: "12 580 €", change: "+8.5%", icon: "revenue" },
    { title: "Marge globale", value: "4 328 €", change: "+4.2%", icon: "margin" },
    { title: "Taux de marge", value: "31.4%", change: "-0.8%", icon: "percentage" },
    { title: "Références vendues", value: "843", change: "+12.6%", icon: "products" }
  ];
  
  // Données pour les actions à mener
  const actionData = [
    { title: "Marges négatives", count: 23, icon: "alert", linkPath: "/dashboard/actions/negative-margins" },
    { title: "Ruptures de stock", count: 15, icon: "empty", linkPath: "/dashboard/actions/stockouts" },
    { title: "Surstock", count: 42, icon: "warehouse", linkPath: "/dashboard/actions/overstock" },
    { title: "Faible rotation", count: 67, icon: "slow", linkPath: "/dashboard/actions/slow-moving" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeader 
          title={`Bonjour, ${session?.user?.name}`}
          subtitle={`Tableau de bord de ${session?.user?.pharmacyName}`}
        />
        
        {/* Cartes statistiques */}
        <StatCards data={statsData} />
        
        {/* Cartes de navigation vers les analyses */}
        <NavigationCards data={navigationData} />
        
        {/* Section du résumé global */}
        <GlobalSummary />
        
        {/* Section des actions à mener */}
        <ActionItems data={actionData} />
      </div>
    </div>
  );
}