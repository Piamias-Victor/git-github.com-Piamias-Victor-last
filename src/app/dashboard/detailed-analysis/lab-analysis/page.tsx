'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { LabSearch } from '@/components/dashboard/labs/LabSearch';
import { LabResultTable } from '@/components/dashboard/labs/LabResultTable';
import { LabSearchStats } from '@/components/dashboard/labs/LabSearchStats';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';
import { LabSalesChart } from '@/components/dashboard/charts/LabSalesChart';
import { useDateRange } from '@/providers/DateRangeProvider';
import { LabStockChart } from '@/components/dashboard/charts/LabStockChart';
import { LabTopProducts } from '@/components/dashboard/labs/LabTopProducts';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { LabStockSummary } from '@/components/dashboard/labs/LabStockSummary';
import { LabMarginSummary } from '@/components/dashboard/labs/LabMarginSummary';
import { LabSalesTrendSummary } from '@/components/dashboard/labs/LabSalesTrendSummary';
import { LabComparisonChart } from '@/components/dashboard/labs/LabComparisonChart';
import { LabSegmentVisualization } from '@/components/dashboard/labs/LabSegmentVisualization';
import { LabAnnualForecast } from '@/components/dashboard/labs/forecast/LabAnnualForecast';
import { LabTargetTracking } from '@/components/dashboard/labs/forecast/LabTargetTracking';

export const mockProductData: Product[] = [
  // Sanofi Products
  {
    id: '1',
    ean: '3400936152786',
    name: 'Doliprane 1000mg Boîte de 8 comprimés',
    laboratory: 'Sanofi',
    category: 'Douleur & Fièvre',
    stock: 42,
    price: '2.18',
    margin: '0.84',
    marginRate: '38.5%',
    sales: 126
  },
  {
    id: '98',
    ean: '3400936152787',
    name: 'Doliprane 500mg Boîte de 8 comprimés',
    laboratory: 'Sanofi',
    category: 'Douleur & Fièvre',
    stock: 21,
    price: '2.18',
    margin: '0.80',
    marginRate: '37.5%',
    sales: 106
  },
  {
    id: '99',
    ean: '3400936152788',
    name: 'Doliprane 500mg Boîte de 8 gellules',
    laboratory: 'Sanofi',
    category: 'Douleur & Fièvre',
    stock: 56,
    price: '2.18',
    margin: '0.86',
    marginRate: '39%',
    sales: 92
  },
  {
    id: '2',
    ean: '3400938101379',
    name: 'Magné B6 Boîte de 60 comprimés',
    laboratory: 'Sanofi',
    category: 'Compléments alimentaires',
    stock: 4,
    price: '9.75',
    margin: '3.12',
    marginRate: '32.0%',
    sales: 18
  },
  {
    id: '3',
    ean: '3400936101456',
    name: 'Euphytose Comprimés',
    laboratory: 'Sanofi',
    category: 'Bien-être & Sommeil',
    stock: 22,
    price: '6.50',
    margin: '1.95',
    marginRate: '30.0%',
    sales: 45
  },
  

  // Pfizer Products
  {
    id: '4',
    ean: '3400930025567',
    name: 'Advil 200mg Boîte de 20 comprimés',
    laboratory: 'Pfizer',
    category: 'Anti-inflammatoires',
    stock: 7,
    price: '3.95',
    margin: '1.32',
    marginRate: '33.4%',
    sales: 54
  },
  {
    id: '5',
    ean: '3400939987654',
    name: 'Prevenar 13 Vaccin',
    laboratory: 'Pfizer',
    category: 'Vaccins',
    stock: 15,
    price: '85.50',
    margin: '25.65',
    marginRate: '30.0%',
    sales: 32
  },
  {
    id: '6',
    ean: '3400930456789',
    name: 'Xeljanz 5mg Comprimés',
    laboratory: 'Pfizer',
    category: 'Rhumatologie',
    stock: 10,
    price: '45.75',
    margin: '13.72',
    marginRate: '30.0%',
    sales: 22
  },

  // UPSA Products
  {
    id: '7',
    ean: '3400935955838',
    name: 'Efferalgan 500mg 16 comprimés effervescents',
    laboratory: 'UPSA',
    category: 'Douleur & Fièvre',
    stock: 18,
    price: '2.65',
    margin: '0.92',
    marginRate: '34.7%',
    sales: 87
  },
  {
    id: '8',
    ean: '3400935123456',
    name: 'Smecta 3g Poudre 30 sachets',
    laboratory: 'UPSA',
    category: 'Digestion',
    stock: 25,
    price: '4.50',
    margin: '1.35',
    marginRate: '30.0%',
    sales: 65
  },

  // Biogaran Products
  {
    id: '9',
    ean: '3400937438483',
    name: 'Amoxicilline Biogaran 500mg Boîte de 12 gélules',
    laboratory: 'Biogaran',
    category: 'Antibiotiques',
    stock: 3,
    price: '6.50',
    margin: '1.85',
    marginRate: '28.5%',
    sales: 32
  },
  {
    id: '10',
    ean: '3400937654321',
    name: 'Méthotrexate Biogaran 2.5mg',
    laboratory: 'Biogaran',
    category: 'Rhumatologie',
    stock: 8,
    price: '15.90',
    margin: '4.77',
    marginRate: '30.0%',
    sales: 25
  },

  // Novartis Products
  {
    id: '11',
    ean: '3400938208733',
    name: 'Voltarène Emulgel 1% 100g',
    laboratory: 'Novartis',
    category: 'Anti-inflammatoires',
    stock: 24,
    price: '8.90',
    margin: '2.65',
    marginRate: '29.8%',
    sales: 37
  },
  {
    id: '12',
    ean: '3400938765432',
    name: 'Glivec 400mg Comprimés',
    laboratory: 'Novartis',
    category: 'Oncologie',
    stock: 6,
    price: '75.20',
    margin: '22.56',
    marginRate: '30.0%',
    sales: 15
  },

  // Other Products
  {
    id: '13',
    ean: '3400930082676',
    name: 'Smecta 3g Poudre pour suspension buvable 30 sachets',
    laboratory: 'Ipsen',
    category: 'Digestion',
    stock: 15,
    price: '5.75',
    margin: '1.42',
    marginRate: '24.7%',
    sales: 41
  },
  {
    id: '14',
    ean: '3400937851572',
    name: 'Imodium 2mg Boîte de 20 gélules',
    laboratory: 'Janssen',
    category: 'Digestion',
    stock: 12,
    price: '4.85',
    margin: '1.52',
    marginRate: '31.3%',
    sales: 28
  },
  {
    id: '15',
    ean: '3400930085745',
    name: 'Daflon 500mg Boîte de 30 comprimés',
    laboratory: 'Servier',
    category: 'Circulation',
    stock: 2,
    price: '10.95',
    margin: '-0.50',
    marginRate: '-4.6%',
    sales: 49
  },
  {
    id: '16',
    ean: '3400937025423',
    name: 'Nurofen 400mg Boîte de 12 capsules',
    laboratory: 'Reckitt Benckiser',
    category: 'Anti-inflammatoires',
    stock: 67,
    price: '4.25',
    margin: '1.05',
    marginRate: '24.7%',
    sales: 15
  }
];

// Fonction pour générer les résultats de laboratoires (déplacée ici pour être accessible)
export function generateMockLabResults(searchTerm: string): Laboratory[] {
  // Liste des laboratoires à filtrer
  const allLabs = [
    { 
      id: 'lab1', 
      name: 'Sanofi', 
      products: 142, 
      revenue: { 
        sellOut: 1850000, 
        sellIn: 2100000 
      }, 
      growth: '+5.2%', 
      margin: '29.8%' 
    },
    { 
      id: 'lab2', 
      name: 'Pfizer', 
      products: 128, 
      revenue: { 
        sellOut: 1620000, 
        sellIn: 1850000 
      }, 
      growth: '+7.4%', 
      margin: '28.5%' 
    },
    { 
      id: 'lab3', 
      name: 'Novartis', 
      products: 115, 
      revenue: { 
        sellOut: 1485000, 
        sellIn: 1700000 
      }, 
      growth: '+3.8%', 
      margin: '30.2%' 
    },
    { 
      id: 'lab4', 
      name: 'Bayer', 
      products: 96, 
      revenue: { 
        sellOut: 1320000, 
        sellIn: 1500000 
      }, 
      growth: '+2.1%', 
      margin: '26.7%' 
    },
    { 
      id: 'lab5', 
      name: 'Roche', 
      products: 88, 
      revenue: { 
        sellOut: 1275000, 
        sellIn: 1450000 
      }, 
      growth: '+4.5%', 
      margin: '31.4%' 
    },
    { 
      id: 'lab6', 
      name: 'GSK', 
      products: 76, 
      revenue: { 
        sellOut: 1145000, 
        sellIn: 1300000 
      }, 
      growth: '+1.8%', 
      margin: '27.3%' 
    },
    { 
      id: 'lab7', 
      name: 'Johnson & Johnson', 
      products: 104, 
      revenue: { 
        sellOut: 1390000, 
        sellIn: 1580000 
      }, 
      growth: '+6.2%', 
      margin: '32.1%' 
    },
    { 
      id: 'lab8', 
      name: 'AstraZeneca', 
      products: 92, 
      revenue: { 
        sellOut: 1180000, 
        sellIn: 1350000 
      }, 
      growth: '+8.5%', 
      margin: '30.8%' 
    },
    { 
      id: 'lab9', 
      name: 'Merck', 
      products: 85, 
      revenue: { 
        sellOut: 1250000, 
        sellIn: 1420000 
      }, 
      growth: '+4.9%', 
      margin: '29.5%' 
    },
    { 
      id: 'lab10', 
      name: 'Eli Lilly', 
      products: 68, 
      revenue: { 
        sellOut: 985000, 
        sellIn: 1120000 
      }, 
      growth: '+5.7%', 
      margin: '28.9%' 
    },
    { 
      id: 'lab11', 
      name: 'Bristol-Myers Squibb', 
      products: 72, 
      revenue: { 
        sellOut: 1050000, 
        sellIn: 1200000 
      }, 
      growth: '+3.2%', 
      margin: '27.6%' 
    },
    { 
      id: 'lab12', 
      name: 'Biogaran', 
      products: 156, 
      revenue: { 
        sellOut: 1420000, 
        sellIn: 1620000 
      }, 
      growth: '+6.8%', 
      margin: '24.3%' 
    },
    { 
      id: 'lab13', 
      name: 'Mylan', 
      products: 102, 
      revenue: { 
        sellOut: 950000, 
        sellIn: 1080000 
      }, 
      growth: '+1.5%', 
      margin: '23.8%' 
    },
    { 
      id: 'lab14', 
      name: 'Teva', 
      products: 118, 
      revenue: { 
        sellOut: 1080000, 
        sellIn: 1230000 
      }, 
      growth: '-0.8%', 
      margin: '22.5%' 
    },
    { 
      id: 'lab15', 
      name: 'Servier', 
      products: 89, 
      revenue: { 
        sellOut: 920000, 
        sellIn: 1050000 
      }, 
      growth: '+2.7%', 
      margin: '26.2%' 
    }
  ];
  
  // Si pas de terme de recherche, retourner tous les laboratoires
  if (!searchTerm.trim()) {
    return allLabs;
  }
  
  const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
  return allLabs.filter(lab => 
    lab.name.toLowerCase().includes(lowercaseSearchTerm)
  );
}

/**
 * Page d'analyse détaillée par laboratoire
 */
export default function LabAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Laboratory[]>([]);
  const { startDate, endDate } = useDateRange();

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Effectuer la recherche
  const handleSearch = (labs: Laboratory[]) => {
    // Soit les laboratoires sélectionnés, soit tous les laboratoires si aucune sélection
    setSearchResults(labs.length > 0 ? labs : generateMockLabResults(''));
  };

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
          title="Analyse par Laboratoire"
          subtitle="Explorez les performances par fabricant ou laboratoire"
        />
        
        {/* Composant de recherche de laboratoires */}
        <LabSearch onSearch={handleSearch} />
        
        {/* Statistiques de recherche */}
        {searchResults.length > 0 && (
          <LabSearchStats laboratories={searchResults} />
        )}
        
        {/* Graphique des ventes de laboratoires */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <LabSalesChart 
              laboratories={searchResults} 
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6">
            <LabStockChart 
              laboratories={searchResults} 
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <LabTopProducts 
              laboratories={searchResults} 
              allProducts={mockProductData} 
            />
            <LabStockSummary 
              laboratories={searchResults} 
              allProducts={mockProductData} 
            />
            <LabMarginSummary 
              laboratories={searchResults} 
              allProducts={mockProductData} 
            />
            <LabSalesTrendSummary 
              laboratories={searchResults} 
              allProducts={mockProductData} 
            />
          </div>
        )}

        {searchResults.length > 0 && (
          <LabComparisonChart 
            laboratories={searchResults} 
            allProducts={mockProductData} 
          />
        )}

        {searchResults.length > 0 && (
          <LabSegmentVisualization 
            laboratories={searchResults} 
            allProducts={mockProductData} 
          />
        )}

        {searchResults.length > 0 && (
          <LabAnnualForecast laboratories={searchResults} />
        )}

        {searchResults.length > 0 && (
          <LabTargetTracking laboratories={searchResults} />
        )}
        
        {/* Tableau des résultats */}
        {searchResults.length > 0 && (
          <LabResultTable laboratories={searchResults} />
        )}
        
        {/* Placeholder si aucun résultat */}
        {searchResults.length === 0 && (
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Utilisez la barre de recherche ci-dessus pour trouver des laboratoires.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}