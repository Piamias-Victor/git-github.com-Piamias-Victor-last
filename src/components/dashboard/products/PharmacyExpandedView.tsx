import React from 'react';
import { FiInfo, FiTrendingUp, FiPackage, FiBarChart2, FiGlobe, FiMap } from 'react-icons/fi';
import { Pharmacy } from './PharmacyResultTable';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { PharmacyDetailsTab } from './PharmacyDetailsTab';
import { PharmacySalesTab } from './PharmacySalesTab';
import { PharmacyStockTab } from './PharmacyStockTab';
import { PharmacyComparisonTab } from './PharmacyComparisonTab';
import { PharmacyMapTab } from './PharmacyMapTab';

interface PharmacyExpandedViewProps {
  pharmacy: Pharmacy;
}

export function PharmacyExpandedView({ pharmacy }: PharmacyExpandedViewProps) {
  const tabs: TabItem[] = [
    {
      id: 'details',
      label: (
        <div className="flex items-center">
          <FiInfo className="mr-2" size={16} /> Détails
        </div>
      ),
      content: <PharmacyDetailsTab pharmacy={pharmacy} />
    },
    {
      id: 'sales',
      label: (
        <div className="flex items-center">
          <FiTrendingUp className="mr-2" size={16} /> Ventes
        </div>
      ),
      content: <PharmacySalesTab pharmacy={pharmacy} />
    },
    {
      id: 'stock',
      label: (
        <div className="flex items-center">
          <FiPackage className="mr-2" size={16} /> Stock
        </div>
      ),
      content: <PharmacyStockTab pharmacy={pharmacy} />
    },
    {
      id: 'analytics',
      label: (
        <div className="flex items-center">
          <FiBarChart2 className="mr-2" size={16} /> Analyse
        </div>
      ),
      content: <PharmacyComparisonTab pharmacy={pharmacy} />
    },
    {
      id: 'location',
      label: (
        <div className="flex items-center">
          <FiMap className="mr-2" size={16} /> Localisation
        </div>
      ),
      content: <PharmacyMapTab pharmacy={pharmacy} />
    }
  ];

  return (
    <Card className="border border-indigo-200 dark:border-indigo-800/50">
      <Tabs tabs={tabs} defaultTab="details" />
    </Card>
  );
}