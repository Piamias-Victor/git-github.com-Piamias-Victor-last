// src/utils/mockMarketData.ts
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

/**
 * Données mockées complètes pour l'analyse de marché
 * Structure hiérarchique: Univers > Catégories > Sous-catégories > Familles
 */

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

// Données de catégories
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
    name: 'Cardiologie',
    type: 'category',
    parent: 'Médicaments',
    products: 28,
    revenue: 210000,
    growth: '-1.2%',
    marketShare: '16.8%',
    dominantLab: 'AstraZeneca'
  },
  {
    id: 'cat5',
    name: 'Respiratoire',
    type: 'category',
    parent: 'Médicaments',
    products: 32,
    revenue: 150000,
    growth: '+2.3%',
    marketShare: '12.0%',
    dominantLab: 'GSK'
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
    name: 'Premiers Soins',
    type: 'category',
    parent: 'Hygiène & Soins',
    products: 38,
    revenue: 145000,
    growth: '+1.8%',
    marketShare: '25.9%',
    dominantLab: 'Hartmann'
  },
  {
    id: 'cat12',
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
    id: 'cat13',
    name: 'Nutrition Infantile',
    type: 'category',
    parent: 'Nutrition',
    products: 28,
    revenue: 85000,
    growth: '+2.1%',
    marketShare: '34.7%',
    dominantLab: 'Nestlé'
  },
  {
    id: 'cat14',
    name: 'Nutrition Sportive',
    type: 'category',
    parent: 'Nutrition',
    products: 15,
    revenue: 28000,
    growth: '+8.3%',
    marketShare: '11.4%',
    dominantLab: 'Eafit'
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
    dominantLab: 'UPSA'
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
  }
];

// Données des laboratoires
export const mockLabs: MarketSegment[] = [
  {
    id: 'lab1',
    name: 'Sanofi',
    type: 'brand_lab',
    products: 85,
    revenue: 485000,
    growth: '+4.2%',
    marketShare: '16.5%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab2',
    name: 'Pfizer',
    type: 'brand_lab',
    products: 64,
    revenue: 425000,
    growth: '+3.6%',
    marketShare: '14.5%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab3',
    name: 'L\'Oréal',
    type: 'brand_lab',
    products: 52,
    revenue: 352000,
    growth: '+8.9%',
    marketShare: '12.0%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab4',
    name: 'GSK',
    type: 'brand_lab',
    products: 48,
    revenue: 312000,
    growth: '+2.1%',
    marketShare: '10.6%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab5',
    name: 'Johnson & Johnson',
    type: 'brand_lab',
    products: 45,
    revenue: 295000,
    growth: '+3.2%',
    marketShare: '10.0%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab6',
    name: 'Vichy',
    type: 'brand_lab',
    products: 38,
    revenue: 265000,
    growth: '+7.4%',
    marketShare: '9.0%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab7',
    name: 'AstraZeneca',
    type: 'brand_lab',
    products: 32,
    revenue: 248000,
    growth: '-0.8%',
    marketShare: '8.4%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab8',
    name: 'Mylan',
    type: 'brand_lab',
    products: 36,
    revenue: 215000,
    growth: '+1.5%',
    marketShare: '7.3%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab9',
    name: 'Arkopharma',
    type: 'brand_lab',
    products: 28,
    revenue: 142000,
    growth: '+6.2%',
    marketShare: '4.8%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab10',
    name: 'Bayer',
    type: 'brand_lab',
    products: 25,
    revenue: 138000,
    growth: '+2.3%',
    marketShare: '4.7%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab11',
    name: 'Avène',
    type: 'brand_lab',
    products: 22,
    revenue: 125000,
    growth: '+9.6%',
    marketShare: '4.3%',
    dominantLab: 'N/A'
  },
  {
    id: 'lab12',
    name: 'Nestlé',
    type: 'brand_lab',
    products: 18,
    revenue: 95000,
    growth: '+1.8%',
    marketShare: '3.2%',
    dominantLab: 'N/A'
  }
];

// Fonction pour obtenir les données mockées en fonction du type de segment
export function getMockSegmentData(type: string): MarketSegment[] {
  switch(type) {
    case 'universe':
      return mockUniverses;
    case 'category':
      return mockCategories;
    case 'sub_category':
      return mockSubCategories;
    case 'family':
      return mockFamilies;
    case 'brand_lab':
      return mockLabs;
    default:
      return mockUniverses;
  }
}