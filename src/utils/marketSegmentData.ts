// src/utils/marketSegmentData.ts
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

// Laboratoires disponibles
export const mockLaboratories = [
  'Sanofi', 'Pfizer', 'GSK', 'Bayer', 'Novartis', 
  'Roche', 'Johnson & Johnson', 'AstraZeneca', 'Merck', 
  'Servier', 'Biogaran', 'Mylan', 'Teva', 'Pierre Fabre', 
  'L\'Oréal', 'Vichy', 'Avène', 'Bioderma', 'La Roche-Posay',
  'Boiron', 'Nestlé', 'Nutricia', 'Arkopharma', 'Upsa'
];

// Données d'univers
export const mockUniverses: MarketSegment[] = [
  {
    id: 'univ1',
    name: 'Médicaments',
    type: 'universe',
    products: 245,
    revenue: 1250000,
    growth: '+5.2%',
    marketShare: '42.5%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'univ2',
    name: 'Parapharmacie',
    type: 'universe',
    products: 180,
    revenue: 880000,
    growth: '+7.8%',
    marketShare: '30.0%',
    dominantLab: 'L\'Oréal'
  },
  {
    id: 'univ3',
    name: 'Hygiène & Soins',
    type: 'universe',
    products: 135,
    revenue: 560000,
    growth: '+3.4%',
    marketShare: '19.1%',
    dominantLab: 'Johnson & Johnson'
  },
  {
    id: 'univ4',
    name: 'Nutrition',
    type: 'universe',
    products: 85,
    revenue: 245000,
    growth: '+4.1%',
    marketShare: '8.4%',
    dominantLab: 'Nutricia'
  }
];

// Données de catégories (liées aux univers)
export const mockCategories: MarketSegment[] = [
  {
    id: 'cat1',
    name: 'Douleur & Fièvre',
    type: 'category',
    parent: 'Médicaments',
    products: 68,
    revenue: 420000,
    growth: '+4.5%',
    marketShare: '33.6%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'cat2',
    name: 'Antibiotiques',
    type: 'category',
    parent: 'Médicaments',
    products: 42,
    revenue: 290000,
    growth: '+1.8%',
    marketShare: '23.2%',
    dominantLab: 'Pfizer'
  },
  {
    id: 'cat3',
    name: 'Système Digestif',
    type: 'category',
    parent: 'Médicaments',
    products: 35,
    revenue: 180000,
    growth: '+3.6%',
    marketShare: '14.4%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'cat4',
    name: 'Respiratoire',
    type: 'category',
    parent: 'Médicaments',
    products: 28,
    revenue: 150000,
    growth: '+2.3%',
    marketShare: '12.0%',
    dominantLab: 'GSK'
  },
  {
    id: 'cat5',
    name: 'Cardiologie',
    type: 'category',
    parent: 'Médicaments',
    products: 39,
    revenue: 185000,
    growth: '-1.2%',
    marketShare: '14.8%',
    dominantLab: 'AstraZeneca'
  },
  {
    id: 'cat6',
    name: 'Soins du Visage',
    type: 'category',
    parent: 'Parapharmacie',
    products: 56,
    revenue: 320000,
    growth: '+9.2%',
    marketShare: '36.4%',
    dominantLab: 'L\'Oréal'
  },
  {
    id: 'cat7',
    name: 'Soins du Corps',
    type: 'category',
    parent: 'Parapharmacie',
    products: 48,
    revenue: 275000,
    growth: '+7.5%',
    marketShare: '31.3%',
    dominantLab: 'Vichy'
  },
  {
    id: 'cat8',
    name: 'Solaires',
    type: 'category',
    parent: 'Parapharmacie',
    products: 32,
    revenue: 165000,
    growth: '+12.8%',
    marketShare: '18.8%',
    dominantLab: 'Avène'
  },
  {
    id: 'cat9',
    name: 'Hygiène Bucco-dentaire',
    type: 'category',
    parent: 'Hygiène & Soins',
    products: 45,
    revenue: 195000,
    growth: '+4.2%',
    marketShare: '34.8%',
    dominantLab: 'Colgate'
  },
  {
    id: 'cat10',
    name: 'Hygiène Corporelle',
    type: 'category',
    parent: 'Hygiène & Soins',
    products: 52,
    revenue: 220000,
    growth: '+2.9%',
    marketShare: '39.3%',
    dominantLab: 'Dove'
  },
  {
    id: 'cat11',
    name: 'Compléments Alimentaires',
    type: 'category',
    parent: 'Nutrition',
    products: 42,
    revenue: 132000,
    growth: '+6.7%',
    marketShare: '53.9%',
    dominantLab: 'Arkopharma'
  },
  {
    id: 'cat12',
    name: 'Nutrition Infantile',
    type: 'category',
    parent: 'Nutrition',
    products: 28,
    revenue: 85000,
    growth: '+2.1%',
    marketShare: '34.7%',
    dominantLab: 'Nestlé'
  }
];

// Données des sous-catégories
export const mockSubCategories: MarketSegment[] = [
  {
    id: 'subcat1',
    name: 'Antipyrétiques',
    type: 'sub_category',
    parent: 'Douleur & Fièvre',
    products: 24,
    revenue: 185000,
    growth: '+3.8%',
    marketShare: '44.0%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'subcat2',
    name: 'Analgésiques',
    type: 'sub_category',
    parent: 'Douleur & Fièvre',
    products: 32,
    revenue: 215000,
    growth: '+5.1%',
    marketShare: '51.2%',
    dominantLab: 'Upsa'
  },
  {
    id: 'subcat3',
    name: 'Anti-inflammatoires',
    type: 'sub_category',
    parent: 'Douleur & Fièvre',
    products: 12,
    revenue: 85000,
    growth: '+2.6%',
    marketShare: '20.2%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'subcat4',
    name: 'Pénicillines',
    type: 'sub_category',
    parent: 'Antibiotiques',
    products: 18,
    revenue: 145000,
    growth: '+0.9%',
    marketShare: '50.0%',
    dominantLab: 'Pfizer'
  },
  {
    id: 'subcat5',
    name: 'Macrolides',
    type: 'sub_category',
    parent: 'Antibiotiques',
    products: 15,
    revenue: 95000,
    growth: '+3.2%',
    marketShare: '32.8%',
    dominantLab: 'Mylan'
  },
  {
    id: 'subcat6',
    name: 'Anti-acides',
    type: 'sub_category',
    parent: 'Système Digestif',
    products: 14,
    revenue: 68000,
    growth: '+4.1%',
    marketShare: '37.8%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'subcat7',
    name: 'Anti-diarrhéiques',
    type: 'sub_category',
    parent: 'Système Digestif',
    products: 11,
    revenue: 58000,
    growth: '+2.7%',
    marketShare: '32.2%',
    dominantLab: 'Johnson & Johnson'
  },
  {
    id: 'subcat8',
    name: 'Antihypertenseurs',
    type: 'sub_category',
    parent: 'Cardiologie',
    products: 16,
    revenue: 128000,
    growth: '-0.8%',
    marketShare: '61.0%',
    dominantLab: 'AstraZeneca'
  },
  {
    id: 'subcat9',
    name: 'Crèmes Hydratantes',
    type: 'sub_category',
    parent: 'Soins du Visage',
    products: 22,
    revenue: 125000,
    growth: '+11.2%',
    marketShare: '39.1%',
    dominantLab: 'L\'Oréal'
  },
  {
    id: 'subcat10',
    name: 'Anti-âge',
    type: 'sub_category',
    parent: 'Soins du Visage',
    products: 18,
    revenue: 142000,
    growth: '+7.5%',
    marketShare: '44.4%',
    dominantLab: 'Vichy'
  }
];

// Données des familles
export const mockFamilies: MarketSegment[] = [
  {
    id: 'fam1',
    name: 'Paracétamol',
    type: 'family',
    parent: 'Antipyrétiques',
    products: 18,
    revenue: 145000,
    growth: '+3.2%',
    marketShare: '78.4%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'fam2',
    name: 'Aspirine',
    type: 'family',
    parent: 'Analgésiques',
    products: 12,
    revenue: 85000,
    growth: '+1.8%',
    marketShare: '39.5%',
    dominantLab: 'Bayer'
  },
  {
    id: 'fam3',
    name: 'Ibuprofène',
    type: 'family',
    parent: 'Anti-inflammatoires',
    products: 8,
    revenue: 68000,
    growth: '+4.2%',
    marketShare: '80.0%',
    dominantLab: 'Mylan'
  },
  {
    id: 'fam4',
    name: 'Amoxicilline',
    type: 'family',
    parent: 'Pénicillines',
    products: 10,
    revenue: 95000,
    growth: '+0.5%',
    marketShare: '65.5%',
    dominantLab: 'GSK'
  },
  {
    id: 'fam5',
    name: 'Azithromycine',
    type: 'family',
    parent: 'Macrolides',
    products: 7,
    revenue: 62000,
    growth: '+2.8%',
    marketShare: '65.3%',
    dominantLab: 'Pfizer'
  },
  {
    id: 'fam6',
    name: 'Crèmes Jour',
    type: 'family',
    parent: 'Crèmes Hydratantes',
    products: 12,
    revenue: 75000,
    growth: '+10.5%',
    marketShare: '60.0%',
    dominantLab: 'La Roche-Posay'
  },
  {
    id: 'fam7',
    name: 'Crèmes Nuit',
    type: 'family',
    parent: 'Crèmes Hydratantes',
    products: 10,
    revenue: 50000,
    growth: '+12.5%',
    marketShare: '40.0%',
    dominantLab: 'Vichy'
  }
];

// Données des sous-familles
export const mockSubFamilies: MarketSegment[] = [
  {
    id: 'subfam1',
    name: 'Paracétamol effervescent',
    type: 'sub_family',
    parent: 'Paracétamol',
    products: 8,
    revenue: 65000,
    growth: '+2.7%',
    marketShare: '44.8%',
    dominantLab: 'Upsa'
  },
  {
    id: 'subfam2',
    name: 'Paracétamol comprimé',
    type: 'sub_family',
    parent: 'Paracétamol',
    products: 10,
    revenue: 80000,
    growth: '+3.5%',
    marketShare: '55.2%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'subfam3',
    name: 'Aspirine 500mg',
    type: 'sub_family',
    parent: 'Aspirine',
    products: 5,
    revenue: 35000,
    growth: '+1.2%',
    marketShare: '41.2%',
    dominantLab: 'Bayer'
  },
  {
    id: 'subfam4',
    name: 'Aspirine 1000mg',
    type: 'sub_family',
    parent: 'Aspirine',
    products: 7,
    revenue: 50000,
    growth: '+2.3%',
    marketShare: '58.8%',
    dominantLab: 'Upsa'
  },
  {
    id: 'subfam5',
    name: 'Ibuprofène 200mg',
    type: 'sub_family',
    parent: 'Ibuprofène',
    products: 4,
    revenue: 28000,
    growth: '+3.8%',
    marketShare: '41.2%',
    dominantLab: 'Mylan'
  },
  {
    id: 'subfam6',
    name: 'Ibuprofène 400mg',
    type: 'sub_family',
    parent: 'Ibuprofène',
    products: 4,
    revenue: 40000,
    growth: '+4.5%',
    marketShare: '58.8%',
    dominantLab: 'Biogaran'
  }
];

// Données des spécificités
export const mockSpecificities: MarketSegment[] = [
  {
    id: 'spec1',
    name: 'Enfants',
    type: 'specificity',
    products: 45,
    revenue: 320000,
    growth: '+5.8%',
    marketShare: '10.9%',
    dominantLab: 'Sanofi'
  },
  {
    id: 'spec2',
    name: 'Femmes enceintes',
    type: 'specificity',
    products: 22,
    revenue: 185000,
    growth: '+4.2%',
    marketShare: '6.3%',
    dominantLab: 'Nestlé'
  },
  {
    id: 'spec3',
    name: 'Seniors',
    type: 'specificity',
    products: 38,
    revenue: 275000,
    growth: '+2.1%',
    marketShare: '9.4%',
    dominantLab: 'Pfizer'
  },
  {
    id: 'spec4',
    name: 'Sportifs',
    type: 'specificity',
    products: 28,
    revenue: 195000,
    growth: '+7.8%',
    marketShare: '6.6%',
    dominantLab: 'Arkopharma'
  },
  {
    id: 'spec5',
    name: 'Bio',
    type: 'specificity',
    products: 32,
    revenue: 220000,
    growth: '+12.5%',
    marketShare: '7.5%',
    dominantLab: 'Pierre Fabre'
  }
];

// Données des laboratoires / marques
export const mockLabs: MarketSegment[] = [
  {
    id: 'lab1',
    name: 'Sanofi',
    type: 'brand_lab',
    products: 85,
    revenue: 485000,
    growth: '+4.2%',
    marketShare: '16.5%'
  },
  {
    id: 'lab2',
    name: 'Pfizer',
    type: 'brand_lab',
    products: 64,
    revenue: 425000,
    growth: '+3.6%',
    marketShare: '14.5%'
  },
  {
    id: 'lab3',
    name: 'L\'Oréal',
    type: 'brand_lab',
    products: 52,
    revenue: 352000,
    growth: '+8.9%',
    marketShare: '12.0%'
  },
  {
    id: 'lab4',
    name: 'GSK',
    type: 'brand_lab',
    products: 48,
    revenue: 312000,
    growth: '+2.1%',
    marketShare: '10.6%'
  },
  {
    id: 'lab5',
    name: 'Johnson & Johnson',
    type: 'brand_lab',
    products: 45,
    revenue: 295000,
    growth: '+3.2%',
    marketShare: '10.0%'
  }
];

// Fonction pour obtenir les segments selon le type
export function getMockSegments(type: string): MarketSegment[] {
  switch(type) {
    case 'universe':
      return mockUniverses;
    case 'category':
      return mockCategories;
    case 'sub_category':
      return mockSubCategories;
    case 'family':
      return mockFamilies;
    case 'sub_family':
      return mockSubFamilies;
    case 'specificity':
      return mockSpecificities;
    case 'brand_lab':
      return mockLabs;
    default:
      return mockUniverses;
  }
}

// Fonction pour rechercher des segments par terme
export function searchMockSegments(searchTerm: string, type?: string): MarketSegment[] {
  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  
  // Si un type spécifique est demandé
  if (type && type !== 'all') {
    const segments = getMockSegments(type);
    return segments.filter(segment => 
      segment.name.toLowerCase().includes(lowerSearchTerm) ||
      (segment.dominantLab && segment.dominantLab.toLowerCase().includes(lowerSearchTerm))
    );
  }
  
  // Sinon, rechercher dans tous les types
  const allSegments = [
    ...mockUniverses,
    ...mockCategories,
    ...mockSubCategories,
    ...mockFamilies,
    ...mockSubFamilies,
    ...mockSpecificities
  ];
  
  return allSegments.filter(segment => 
    segment.name.toLowerCase().includes(lowerSearchTerm) ||
    (segment.dominantLab && segment.dominantLab.toLowerCase().includes(lowerSearchTerm))
  );
}

// Formater les valeurs monétaires
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}