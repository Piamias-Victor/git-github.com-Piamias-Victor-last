// src/types/product.ts

/**
 * Interface pour les données de ventes de produits
 */
export interface ProductSalesData {
    date: string;
    quantity: number;
    revenue: number;
    margin: number;
  }
  
  /**
   * Interface pour les données de stock de produits
   */
  export interface ProductStockData {
    date: string;
    stock: number;
    value: number;
    stockouts: number;
  }
  
  /**
   * Interface pour les données de produit
   */
  export interface Product {
    id: string;
    ean: string;
    name: string;
    laboratory: string;
    category: string;
    stock: number;
    price: string;
    margin: string;
    marginRate: string;
    sales: number;
  }