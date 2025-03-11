// src/components/dashboard/labs/visualization/useSegmentData.ts
import { useMemo } from 'react';
import { Product } from '@/components/dashboard/products/ProductResultTable';
import { Laboratory } from '@/components/dashboard/labs/LabResultTable';
import { enrichProductsWithSegmentData, generateLaboratoryPositioning } from './mockSegmentData';

// Types pour les données du TreeMap
export interface TreeMapData {
  name: string;
  value: number;
  children?: TreeMapData[];
  color?: string;
  products?: Product[];
}

// Type des segments
export type SegmentType = 'universe' | 'category' | 'family' | 'range';

// Couleurs pour les différents niveaux
export const SEGMENT_COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', 
  '#D97706', '#BE185D', '#6366F1', '#65A30D'
];

// Interface pour les statistiques des segments
export interface SegmentStats {
  totalProducts: number;
  segmentCount: number;
  topSegment: {
    name: string;
    count: number;
    percentage: number;
  };
}

// Interface pour les données de positionnement
export interface PositioningData {
  segment: string;
  segmentType: 'universe' | 'category' | 'family';
  rank: number;
  totalCompetitors: number;
  marketShare: number;
  leadingCompetitor: string;
  leadingCompetitorShare: number;
  competitors: {
    name: string;
    share: number;
    isMain: boolean;
  }[];
}

/**
 * Hook personnalisé pour extraire et analyser les données des segments de produits
 * pour les laboratoires sélectionnés
 */
export function useSegmentData(
  laboratories: Laboratory[],
  allProducts: Product[],
  segmentType: SegmentType
) {
  // Enrichir les données produit avec des segments si nécessaire
  const enrichedProducts = useMemo(() => {
    return enrichProductsWithSegmentData(allProducts);
  }, [allProducts]);

  // Filtrer les produits des laboratoires sélectionnés
  const labProducts = useMemo(() => 
    enrichedProducts.filter(product => 
      laboratories.some(lab => lab.name === product.laboratory)
    )
  , [enrichedProducts, laboratories]);

  // Générer les données du TreeMap selon le segment actif
  const treeMapData = useMemo(() => {
    if (!labProducts.length) return { name: 'Segments', children: [] };

    // Mapper le type de segment au champ correspondant dans les données de produit
    const getSegmentField = (segType: SegmentType): string => {
      switch (segType) {
        case 'universe': return 'universe';
        case 'category': return 'category';
        case 'family': return 'family';
        case 'range': return 'range_name';
        default: return 'category';
      }
    };

    const segmentField = getSegmentField(segmentType);
    const segments: Record<string, Product[]> = {};
    
    // Grouper les produits par la valeur du segment
    labProducts.forEach(product => {
      const segmentValue = product[segmentField] || 'Non défini';
      if (!segments[segmentValue]) {
        segments[segmentValue] = [];
      }
      segments[segmentValue].push(product);
    });
    
    // Transformer en format pour TreeMap
    const children = Object.entries(segments)
      .map(([name, products], index) => ({
        name,
        value: products.length,
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
        products
      }))
      .sort((a, b) => b.value - a.value); // Trier par nombre de produits (décroissant)
    
    return {
      name: 'Segments',
      children
    };
  }, [labProducts, segmentType]);

  // Statistiques sur les segments
  const stats = useMemo(() => {
    const totalProducts = labProducts.length;
    const segmentCount = treeMapData.children.length;
    
    let topSegment = { name: '', count: 0, percentage: 0 };
    
    if (segmentCount > 0) {
      const top = treeMapData.children[0];
      topSegment = {
        name: top.name,
        count: top.value,
        percentage: (top.value / totalProducts) * 100
      };
    }
    
    return {
      totalProducts,
      segmentCount,
      topSegment
    };
  }, [treeMapData, labProducts]);

  // Répartition des ventes par segment
  const segmentSalesData = useMemo(() => {
    if (!treeMapData.children.length) return [];
    
    return treeMapData.children.map(segment => {
      const products = segment.products || [];
      const totalSales = products.reduce((sum, product) => sum + product.sales, 0);
      const totalRevenue = products.reduce(
        (sum, product) => sum + (product.sales * parseFloat(product.price)), 
        0
      );
      
      return {
        name: segment.name,
        count: segment.value,
        sales: totalSales,
        revenue: totalRevenue,
        color: segment.color
      };
    });
  }, [treeMapData]);

  // Données de positionnement - seulement pour universe, category et family
  const positioningData = useMemo(() => {
    // Ne pas générer de positionnement pour les gammes
    if (segmentType === 'range' || !stats.topSegment.name || laboratories.length === 0) {
      return null;
    }
    
    // Générer des données de positionnement pour le premier laboratoire
    const mainLab = laboratories[0].name;
    
    // Pour chaque segmentType, utiliser le segment principal
    return generateLaboratoryPositioning(
      mainLab,
      segmentType as 'universe' | 'category' | 'family',
      stats.topSegment.name
    );
  }, [segmentType, stats.topSegment.name, laboratories]);

  return {
    treeMapData,
    stats,
    segmentSalesData,
    positioningData
  };
}