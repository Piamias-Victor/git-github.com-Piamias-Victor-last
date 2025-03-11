// src/components/dashboard/labs/visualization/LabSegmentVisualization.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { SegmentType, useSegmentData } from './useSegmentData';
import { SegmentStatsCards } from './SegmentStatsCards';
import { LabSegmentTreeMap } from './LabSegmentTreeMap';
import { SegmentSalesChart } from './SegmentSalesChart';
import { SegmentPositioningCard } from './SegmentPositioningCard';
import { LoadingState, ErrorState } from '@/components/ui/LoadingState';

interface LabSegmentVisualizationProps {
  laboratories: Laboratory[];
  allProducts: Product[];
  isLoading?: boolean;
  error?: string | null;
}

// Mapper le type de segment à un titre lisible
const segmentTitles: Record<SegmentType, string> = {
  'universe': 'Univers',
  'category': 'Catégories',
  'family': 'Familles',
  'range': 'Gammes'
};

export function LabSegmentVisualization({
  laboratories,
  allProducts,
  isLoading = false,
  error = null
}: LabSegmentVisualizationProps) {
  const [activeSegment, setActiveSegment] = useState<SegmentType>('universe');
  
  // Utiliser notre hook personnalisé pour obtenir les données des segments
  const { treeMapData, stats, segmentSalesData, positioningData } = useSegmentData(
    laboratories,
    allProducts,
    activeSegment
  );

  // Gérer les états de chargement et d'erreur
  if (isLoading) return <LoadingState height="60" message="Analyse des segments en cours..." />;
  if (error) return <ErrorState message={error} />;

  // Construire les onglets pour chaque type de segment
  const tabs: TabItem[] = Object.entries(segmentTitles).map(([key, title]) => ({
    id: key,
    label: title,
    content: null // Nous n'utilisons pas le contenu des onglets car nous gérons l'affichage nous-mêmes
  }));

  // Gérer le changement d'onglet
  const handleTabChange = (tabId: string) => {
    console.log(`Changing segment type to: ${tabId}`);
    setActiveSegment(tabId as SegmentType);
  };

  // Vérifier si nous devons afficher le positionnement
  const showPositioning = positioningData && activeSegment !== 'range';

  return (
    <div className="mt-8">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analyse par {segmentTitles[activeSegment]}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">{stats.totalProducts}</span> produits • <span className="font-medium">{stats.segmentCount}</span> {segmentTitles[activeSegment].toLowerCase()}
            </div>
          </div>

          {/* Onglets pour sélectionner le type de segment */}
          <div className="mb-6">
            <Tabs 
              tabs={tabs} 
              defaultTab={activeSegment}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Statistiques des segments */}
          <SegmentStatsCards 
            stats={stats} 
            segmentType={activeSegment} 
          />

          {/* Positionnement du laboratoire (différent selon le type de segment) */}
          {showPositioning ? (
            <div className="mb-6">
              <SegmentPositioningCard 
                positioning={positioningData} 
                labName={laboratories[0].name} 
              />
            </div>
          ) : activeSegment === 'range' && (
            <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Information sur les gammes
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Les gammes sont spécifiques à chaque laboratoire et ne font pas l'objet de comparaison entre concurrents
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Le laboratoire <span className="font-medium">{laboratories[0].name}</span> dispose de 
                  <span className="font-medium"> {stats.segmentCount} gammes</span> différentes.
                  {stats.segmentCount > 0 && stats.topSegment.name && (
                    ` La gamme principale est "${stats.topSegment.name}" avec ${stats.topSegment.count} produits 
                    (${stats.topSegment.percentage.toFixed(1)}% du portefeuille).`
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Visualisation des segments */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* TreeMap des segments */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Répartition des {segmentTitles[activeSegment]}
              </h4>
              <div className="h-80">
                {treeMapData && treeMapData.children && treeMapData.children.length > 0 ? (
                  <LabSegmentTreeMap 
                    treeMapData={treeMapData} 
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Aucune donnée disponible pour la visualisation
                  </div>
                )}
              </div>
            </div>

            {/* Graphique des ventes par segment */}
            <SegmentSalesChart 
              segmentSalesData={segmentSalesData} 
              segmentType={activeSegment} 
            />
          </div>

          {/* Section d'interprétation */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Interprétation de l'analyse
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stats.segmentCount > 0 ? (
                <>
                  Cette analyse vous montre la répartition des produits par {activeSegment.toLowerCase()}. 
                  Le {activeSegment.toLowerCase()} principal est <span className="font-medium">{stats.topSegment.name}</span> avec 
                  {' '}{stats.topSegment.count} produits ({stats.topSegment.percentage.toFixed(1)}% du total).
                  {stats.segmentCount > 5 && (
                    ` Vous avez une diversité importante avec ${stats.segmentCount} ${segmentTitles[activeSegment].toLowerCase()} différents.`
                  )}
                  {stats.segmentCount <= 3 && (
                    ` Votre portefeuille est concentré sur un petit nombre de ${segmentTitles[activeSegment].toLowerCase()}.`
                  )}
                  {showPositioning && (
                    ` Sur ${positioningData.segment}, vous occupez la ${positioningData.rank === 1 ? 'première' : `${positioningData.rank}ème`} position avec une part de marché de ${positioningData.marketShare}%.`
                  )}
                </>
              ) : (
                `Aucun ${activeSegment.toLowerCase()} n'a été identifié pour les laboratoires sélectionnés.`
              )}
            </p>
          </div>

          {/* Recommandations stratégiques */}
          {showPositioning && (
            <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Recommandations stratégiques
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {positioningData.rank === 1 ? (
                  <>
                    {activeSegment === 'universe' && 
                      `En tant que leader sur l'univers ${positioningData.segment}, nous vous recommandons de consolider votre position dominante en élargissant votre gamme de produits et en investissant dans des campagnes de notoriété. Surveillez attentivement ${positioningData.competitors[1]?.name || 'votre principal concurrent'} qui détient ${positioningData.competitors[1]?.share || 0}% de parts de marché.`
                    }
                    {activeSegment === 'category' && 
                      `Votre position de leader dans la catégorie ${positioningData.segment} est un atout stratégique. Capitalisez sur cette force en développant de nouvelles indications ou formulations pour renforcer votre expertise. Envisagez des partenariats exclusifs avec les grossistes pour sécuriser votre distribution.`
                    }
                    {activeSegment === 'family' && 
                      `Vous dominez la famille ${positioningData.segment} avec une part de marché de ${positioningData.marketShare}%. Protégez cette position en investissant dans l'innovation et en augmentant la visibilité de vos produits dans les pharmacies. Envisagez des programmes de fidélité ou des remises volume pour les pharmaciens.`
                    }
                  </>
                ) : positioningData.rank === 2 ? (
                  <>
                    {activeSegment === 'universe' && 
                      `En tant que challenger sur l'univers ${positioningData.segment}, concentrez vos efforts sur des segments où vous pouvez vous différencier de ${positioningData.leadingCompetitor}. Une stratégie d'acquisition ciblée pourrait vous permettre de combler rapidement l'écart de ${(positioningData.leadingCompetitorShare - positioningData.marketShare).toFixed(1)}% qui vous sépare de la première place.`
                    }
                    {activeSegment === 'category' && 
                      `Votre position de challenger dans la catégorie ${positioningData.segment} est prometteuse. Analysez les forces et faiblesses de ${positioningData.leadingCompetitor} pour identifier les opportunités. Une campagne de sensibilisation auprès des prescripteurs pourrait vous permettre de gagner des parts de marché.`
                    }
                    {activeSegment === 'family' && 
                      `Sur la famille ${positioningData.segment}, vous êtes bien positionné en seconde place. Envisagez de vous différencier par un positionnement prix plus compétitif ou par une innovation de formulation pour dépasser ${positioningData.leadingCompetitor}.`
                    }
                  </>
                ) : positioningData.rank <= positioningData.totalCompetitors / 2 ? (
                  <>
                    {activeSegment === 'universe' && 
                      `Votre position dans le milieu du classement sur l'univers ${positioningData.segment} suggère une stratégie de concentration. Identifiez les niches à forte marge où vous pourriez développer une expertise reconnue, plutôt que de concurrencer frontalement les leaders sur l'ensemble du marché.`
                    }
                    {activeSegment === 'category' && 
                      `Dans la catégorie ${positioningData.segment}, votre position intermédiaire nécessite de faire des choix stratégiques. Concentrez vos ressources sur un nombre limité de produits à fort potentiel pour créer un effet de levier et maximiser votre impact commercial.`
                    }
                    {activeSegment === 'family' && 
                      `Au sein de la famille ${positioningData.segment}, vous pourriez gagner des parts de marché en ciblant des segments spécifiques de patients ou en proposant des formulations innovantes pour des besoins non satisfaits.`
                    }
                  </>
                ) : (
                  <>
                    {activeSegment === 'universe' && 
                      `Votre faible position sur l'univers ${positioningData.segment} suggère de réorienter votre stratégie. Envisagez des partenariats stratégiques, des acquisitions ciblées ou une redéfinition de votre offre pour vous concentrer sur des segments plus porteurs où vous pouvez créer de la valeur.`
                    }
                    {activeSegment === 'category' && 
                      `Dans la catégorie ${positioningData.segment}, votre position actuelle indique qu'une refonte de votre approche est nécessaire. Évaluez si cette catégorie reste stratégique pour votre laboratoire ou si vous devriez réallouer vos ressources vers des domaines plus porteurs.`
                    }
                    {activeSegment === 'family' && 
                      `Pour la famille ${positioningData.segment}, il serait judicieux d'évaluer la pertinence de maintenir votre présence. Si vous décidez de continuer, une alliance avec un autre laboratoire ou une approche de niche très ciblée pourrait être plus pertinente qu'une stratégie généraliste.`
                    }
                  </>
                )}
              </p>
            </div>
          )}
          {activeSegment === 'range' && stats.segmentCount > 0 && (
            <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Recommandations pour les gammes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.segmentCount >= 5 ? (
                  `Avec ${stats.segmentCount} gammes différentes, votre portefeuille est très diversifié. Nous recommandons une analyse approfondie de la rentabilité de chaque gamme pour identifier celles qui méritent un investissement supplémentaire et celles qui pourraient être rationalisées. La gamme "${stats.topSegment.name}" représente ${stats.topSegment.percentage.toFixed(1)}% de votre portefeuille et devrait faire l'objet d'une attention particulière en termes de promotion et de développement.`
                ) : stats.segmentCount >= 3 ? (
                  `Votre portefeuille de ${stats.segmentCount} gammes semble bien équilibré. Pour optimiser vos performances, nous suggérons de renforcer l'identité visuelle et la cohérence de la gamme "${stats.topSegment.name}" qui est votre principale gamme, et d'évaluer les opportunités d'extension de gamme pour capturer des segments adjacents.`
                ) : (
                  `Avec seulement ${stats.segmentCount} gamme(s), votre portefeuille est très concentré. Cette approche peut être efficace si vous êtes spécialisé, mais présente aussi des risques en cas de difficultés sur votre gamme principale. Nous recommandons d'étudier les opportunités de développement de nouvelles gammes complémentaires pour diversifier votre offre et réduire ce risque.`
                )}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}