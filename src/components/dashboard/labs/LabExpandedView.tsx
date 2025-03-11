// src/components/dashboard/labs/LabExpandedView.tsx
import React from 'react';
import { FiInfo, FiTrendingUp, FiPackage, FiPieChart, FiGlobe } from 'react-icons/fi';
import { Laboratory } from './LabResultTable';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';


interface LabExpandedViewProps {
  laboratory: Laboratory;
}

/**
 * Composant d'affichage détaillé d'un laboratoire avec onglets
 */
export function LabExpandedView({ laboratory }: LabExpandedViewProps) {
  const tabs: TabItem[] = [
    {
      id: 'details',
      label: (
        <div className="flex items-center">
          <FiInfo className="mr-2" size={16} /> Détails
        </div>
      ),
      content: <></>
    //   content: <LabDetailsTab laboratory={laboratory} />
    },
    {
      id: 'performance',
      label: (
        <div className="flex items-center">
          <FiTrendingUp className="mr-2" size={16} /> Performance
        </div>
      ),
      content: <></>
    //   content: <LabPerformanceTab laboratory={laboratory} />
    },
    {
      id: 'products',
      label: (
        <div className="flex items-center">
          <FiPackage className="mr-2" size={16} /> Produits
        </div>
      ),
      content: <></>
    //   content: <LabProductsTab laboratory={laboratory} />
    },
    {
      id: 'distribution',
      label: (
        <div className="flex items-center">
          <FiPieChart className="mr-2" size={16} /> Répartition
        </div>
      ),
      content: <></>
    //   content: <LabDistributionTab laboratory={laboratory} />
    },
    {
      id: 'comparison',
      label: (
        <div className="flex items-center">
          <FiGlobe className="mr-2" size={16} /> Moyenne groupement
        </div>
      ),
      content: <></>
    //   content: <LabComparisonTab laboratory={laboratory} />
    }
  ];

  return (
    <Card className="border border-indigo-200 dark:border-indigo-800/50">
      <Tabs tabs={tabs} defaultTab="details" />
    </Card>
  );
}