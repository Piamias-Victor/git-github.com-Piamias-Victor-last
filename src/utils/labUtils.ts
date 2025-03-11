import { Laboratory } from '@/components/dashboard/labs/LabResultTable';

export function generateMockLabResults(searchTerm: string): Laboratory[] {
  // Votre implémentation actuelle de la fonction
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