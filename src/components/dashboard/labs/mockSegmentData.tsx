// src/utils/mockSegmentData.ts
import { Product } from '@/components/dashboard/products/ProductResultTable';

/**
 * Enrichit les données produit avec des informations de segment
 * @param products Liste des produits à enrichir
 * @returns Les produits avec des informations de segment ajoutées
 */
export function enrichProductsWithSegmentData(products: Product[]): Product[] {
  // Définition des univers, catégories, familles et gammes
  const universes = [
    'Médicaments', 'Parapharmacie', 'Hygiène & Soins', 'Nutrition', 'Matériel Médical'
  ];
  
  const categoriesByUniverse: Record<string, string[]> = {
    'Médicaments': ['Douleur & Fièvre', 'Antibiotiques', 'Système Digestif', 'Circulation', 'Respiratoire', 'Rhumatologie', 'Oncologie', 'Vaccins'],
    'Parapharmacie': ['Beauté', 'Solaires', 'Dermatologie', 'Minceur'],
    'Hygiène & Soins': ['Hygiène Bucco-dentaire', 'Soins du Corps', 'Hygiène Intime', 'Premiers Soins'],
    'Nutrition': ['Compléments alimentaires', 'Nutrition Infantile', 'Diététique', 'Bien-être & Sommeil'],
    'Matériel Médical': ['Orthopédie', 'Diagnostic', 'Pansements', 'Incontinence']
  };
  
  const familiesByCategory: Record<string, string[]> = {
    'Douleur & Fièvre': ['Antalgiques', 'Anti-inflammatoires', 'Fébrifuges'],
    'Antibiotiques': ['Pénicillines', 'Macrolides', 'Quinolones'],
    'Système Digestif': ['Anti-acides', 'Antidiarrhéiques', 'Laxatifs'],
    'Beauté': ['Soins du visage', 'Soins anti-âge', 'Maquillage'],
    'Compléments alimentaires': ['Vitamines', 'Minéraux', 'Probiotiques', 'Phytothérapie']
  };
  
  const rangeByLaboratory: Record<string, string[]> = {
    'Sanofi': ['Doliprane', 'Magné B6', 'Essentiel', 'Rhinathiol'],
    'Pfizer': ['Advil', 'Vaxigrip', 'Xeljanz'],
    'UPSA': ['Efferalgan', 'Dafalgan', 'Fervex'],
    'Biogaran': ['BioG', 'Essential Génériques'],
    'Novartis': ['Voltarène', 'Glivec'],
    'GSK': ['Augmentin', 'Ventoline', 'Zovirax'],
    'Boiron': ['Oscillococcinum', 'Homéodent', 'Arnigel'],
    'Pierre Fabre': ['Avène', 'Ducray', 'Klorane']
  };
  
  // Map des univers pour chaque catégorie
  const universeForCategories: Record<string, string> = {};
  Object.entries(categoriesByUniverse).forEach(([universe, categories]) => {
    categories.forEach(category => {
      universeForCategories[category] = universe;
    });
  });
  
  // Map des catégories pour chaque famille
  const categoryForFamilies: Record<string, string> = {};
  Object.entries(familiesByCategory).forEach(([category, families]) => {
    families.forEach(family => {
      categoryForFamilies[family] = category;
    });
  });
  
  // Fonction pour attribuer des segments cohérents aux produits
  return products.map(product => {
    // Trouver ou assigner une gamme
    let range_name = '';
    const labRanges = rangeByLaboratory[product.laboratory];
    if (labRanges && labRanges.length > 0) {
      range_name = labRanges[Math.floor(Math.random() * labRanges.length)];
    } else {
      range_name = 'Gamme Standard';
    }
    
    // Utiliser la catégorie existante si disponible, sinon en assigner une aléatoirement
    let category = product.category;
    if (!category || category === 'Non défini') {
      const allCategories = Object.values(categoriesByUniverse).flat();
      category = allCategories[Math.floor(Math.random() * allCategories.length)];
    }
    
    // Déterminer l'univers basé sur la catégorie
    const universe = universeForCategories[category] || universes[Math.floor(Math.random() * universes.length)];
    
    // Déterminer la famille basée sur la catégorie
    let family = '';
    const categoryFamilies = familiesByCategory[category];
    if (categoryFamilies && categoryFamilies.length > 0) {
      family = categoryFamilies[Math.floor(Math.random() * categoryFamilies.length)];
    } else {
      family = 'Famille Standard';
    }
    
    // Retourner le produit enrichi
    return {
      ...product,
      category,
      universe,
      family,
      range_name
    };
  });
}

/**
 * Génère des données de positionnement pour un laboratoire par rapport à ses concurrents
 * @param labName Nom du laboratoire
 * @param segmentType Type de segment (universe, category, family)
 * @param segmentName Nom du segment spécifique
 * @returns Données de positionnement
 */
export function generateLaboratoryPositioning(
  labName: string, 
  segmentType: 'universe' | 'category' | 'family',
  segmentName: string
) {
  // Générer des concurrents fictifs
  const competitors = [
    'Sanofi', 'Pfizer', 'Novartis', 'Bayer', 'Roche', 'GSK', 
    'Johnson & Johnson', 'AstraZeneca', 'Merck', 'Eli Lilly',
    'Bristol-Myers Squibb', 'Biogaran', 'Mylan', 'Teva', 'Servier'
  ].filter(name => name !== labName).slice(0, 4);
  
  // Ajouter le laboratoire à la liste
  const allLabs = [labName, ...competitors];
  
  // Générer des parts de marché aléatoires mais réalistes en fonction du type de segment
  let remainingShare = 100;
  const marketShares: Record<string, number> = {};
  
  // Assigner une part de marché différente selon le type de segment
  let mainLabShare;
  
  // Différentes stratégies selon le type de segment
  switch (segmentType) {
    case 'universe':
      // Pour les univers, le laboratoire est moins dominant (15-25%)
      mainLabShare = 15 + Math.floor(Math.random() * 10);
      break;
    case 'category':
      // Pour les catégories, le laboratoire peut être plus spécialisé (20-35%)
      mainLabShare = 20 + Math.floor(Math.random() * 15);
      break;
    case 'family':
      // Pour les familles, encore plus de spécialisation possible (25-45%)
      mainLabShare = 25 + Math.floor(Math.random() * 20);
      break;
    default:
      mainLabShare = 20 + Math.floor(Math.random() * 15);
  }
  
  marketShares[labName] = mainLabShare;
  remainingShare -= mainLabShare;
  
  // Distribuer le reste entre les concurrents
  for (let i = 0; i < competitors.length; i++) {
    if (i === competitors.length - 1) {
      // Dernier concurrent prend le reste
      marketShares[competitors[i]] = remainingShare;
    } else {
      // Distribuer aléatoirement avec des parts plus importantes pour les concurrents principaux
      // dans les univers, plus fragmenté dans les catégories et familles
      let maxShare;
      switch (segmentType) {
        case 'universe':
          maxShare = 25;
          break;
        case 'category':
          maxShare = 20;
          break;
        case 'family':
          maxShare = 15;
          break;
        default:
          maxShare = 20;
      }
      
      const share = Math.min(
        remainingShare - (competitors.length - i - 1), // Assurer qu'il reste assez pour les autres
        Math.floor(Math.random() * maxShare) + 5 // Entre 5% et maxShare%
      );
      marketShares[competitors[i]] = share;
      remainingShare -= share;
    }
  }
  
  // Trier par part de marché décroissante
  const sortedLabs = allLabs.sort((a, b) => marketShares[b] - marketShares[a]);
  
  // Trouver le classement du laboratoire principal
  const rank = sortedLabs.indexOf(labName) + 1;
  
  // Créer les données de positionnement
  return {
    segment: segmentName,
    segmentType,
    rank,
    totalCompetitors: allLabs.length,
    marketShare: marketShares[labName],
    leadingCompetitor: sortedLabs[0],
    leadingCompetitorShare: marketShares[sortedLabs[0]],
    competitors: sortedLabs.map(lab => ({
      name: lab,
      share: marketShares[lab],
      isMain: lab === labName
    }))
  };
}