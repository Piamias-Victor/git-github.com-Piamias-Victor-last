// src/utils/filterUtils.ts
import { Product } from '../components/dashboard/products/ProductResultTable';

/**
 * Filtre les produits en fonction des critères spécifiés
 * @param products Liste des produits à filtrer
 * @param filterType Type de filtre ('stock', 'margin', 'trend')
 * @param filterValue Valeur du filtre
 */
export function filterProducts(products: Product[], filterType: string, filterValue: string): Product[] {
  switch (filterType) {
    case 'stock':
      return filterByStock(products, filterValue);
    case 'margin':
      return filterByMargin(products, filterValue);
    case 'trend':
      return filterByTrend(products, filterValue);
    default:
      return products;
  }
}

/**
 * Filtre les produits en fonction du niveau de stock
 */
function filterByStock(products: Product[], filterValue: string): Product[] {
  switch (filterValue) {
    case 'critical':
      return products.filter(p => p.stock <= 5);
    case 'watch':
      return products.filter(p => p.stock > 5 && p.stock <= 20);
    case 'optimal':
      return products.filter(p => p.stock > 20 && p.stock <= 50);
    case 'over':
      return products.filter(p => p.stock > 50);
    default:
      return products;
  }
}

/**
 * Filtre les produits en fonction du taux de marge
 */
function filterByMargin(products: Product[], filterValue: string): Product[] {
  switch (filterValue) {
    case 'negative':
      return products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate <= 0;
      });
    case 'low':
      return products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate > 0 && rate < 20;
      });
    case 'good':
      return products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate >= 20 && rate <= 35;
      });
    case 'excellent':
      return products.filter(p => {
        const rate = parseFloat(p.marginRate.replace('%', ''));
        return rate > 35;
      });
    default:
      return products;
  }
}

/**
 * Filtre les produits en fonction de la tendance des ventes
 * Dans une application réelle, ces données viendraient de la BD
 * Ici, nous utilisons une simulation basée sur le nom du produit pour être cohérent
 */
function filterByTrend(products: Product[], filterValue: string): Product[] {
  // Dans une application réelle, cette fonction accéderait aux vraies données de tendance
  // Ici, on simule un filtrage basé sur un hash du nom de produit
  return products.filter(p => {
    const hash = p.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const normalized = hash % 100;
    
    switch (filterValue) {
      case 'high-decline':
        return normalized < 12;
      case 'low-decline':
        return normalized >= 12 && normalized < 33;
      case 'stable':
        return normalized >= 33 && normalized < 68;
      case 'low-growth':
        return normalized >= 68 && normalized < 86;
      case 'high-growth':
        return normalized >= 86;
      default:
        return true;
    }
  });
}