// src/utils/productDataUtils.ts

import { ProductSalesData, ProductStockData } from "../../types/product";

/**
 * Génère des données de vente simulées pour un produit
 * Dans une implémentation réelle, cette fonction serait remplacée par un appel API
 * 
 * @param productId ID du produit
 * @param startDate Date de début au format YYYY-MM-DD
 * @param endDate Date de fin au format YYYY-MM-DD
 * @returns Tableau de données de vente
 */
export function generateSalesData(productId: string, startDate: string, endDate: string): ProductSalesData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: ProductSalesData[] = [];
  
  // Générer des données mensuelles
  const currentDate = new Date(start);
  currentDate.setDate(1); // Premier jour du mois
  
  // Facteur pour simuler une tendance générale à la hausse
  const trendFactor = 1.05; 
  
  // Définir un point de départ de base pour la quantité
  const initialBaseQuantity = 20;
  let cumulativeTrend = 1;
  
  while (currentDate <= end) {
    // Base de ventes avec une légère tendance à la hausse et variation saisonnière
    const month = currentDate.getMonth();
    
    // Effet saisonnier
    const seasonalFactor = 1 + Math.sin(month / 12 * 2 * Math.PI) * 0.2; // ±20% variation saisonnière
    
    // Appliquer la tendance cumulative (croissance ou décroissance progressive)
    cumulativeTrend *= Math.random() < 0.7 ? trendFactor : 0.98; // 70% chance de croissance, 30% de légère baisse
    
    // Génère une quantité de base qui varie selon le mois (effet saisonnier) et la tendance
    const baseQuantity = initialBaseQuantity * seasonalFactor * cumulativeTrend;
    
    // Ajoute une variation aléatoire à la quantité de base
    const quantity = Math.max(0, Math.round(baseQuantity + (Math.random() * 10 - 5)));
    
    // Prix et marges différents selon les mois (simuler des promotions ou changements de prix)
    // Fréquence de promotion plus élevée pendant certaines saisons
    const isPromoMonth = month === 11 || month === 6 || Math.random() < 0.2; // Promos en été et Noël
    const promoFactor = isPromoMonth ? 0.85 : 1; // réduction de 15% pendant les promos
    
    // Calcule un prix moyen et une marge pour ce mois (varient légèrement)
    const avgPrice = (4 + (Math.random() * 0.5)) * promoFactor;
    const marginRate = isPromoMonth ? 0.25 : 0.32; // marge réduite pendant les promotions
    const avgMargin = avgPrice * marginRate;
    
    // Calcule le revenu et la marge totale
    const revenue = quantity * avgPrice;
    const margin = quantity * avgMargin;
    
    result.push({
      date: currentDate.toISOString().split('T')[0], // Format YYYY-MM-DD
      quantity,
      revenue: parseFloat(revenue.toFixed(2)),
      margin: parseFloat(margin.toFixed(2))
    });
    
    // Passe au mois suivant
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return result;
}

/**
 * Génère des données de stock simulées pour un produit
 * Dans une implémentation réelle, cette fonction serait remplacée par un appel API
 * 
 * @param productId ID du produit
 * @param startDate Date de début au format YYYY-MM-DD
 * @param endDate Date de fin au format YYYY-MM-DD
 * @returns Tableau de données de stock
 */
export function generateStockData(productId: string, startDate: string, endDate: string): ProductStockData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: ProductStockData[] = [];
  
  // Générer des données mensuelles
  const currentDate = new Date(start);
  currentDate.setDate(1); // Premier jour du mois
  
  // Valeurs de base pour simuler des fluctuations de stock
  let baseStock = 35; // Stock initial du produit
  const avgUnitPrice = 4.5; // Prix unitaire moyen du produit
  
  while (currentDate <= end) {
    const month = currentDate.getMonth();
    
    // Simuler des fluctuations saisonnières du stock
    // Stock plus bas en hiver (saison des rhumes) et été (vacances)
    const seasonalFactor = 1 - 0.2 * Math.sin((month + 3) / 12 * 2 * Math.PI);
    
    // Ajouter une variation aléatoire
    const randomVariation = (Math.random() * 0.3 - 0.15); // ±15%
    const stockFactor = seasonalFactor + randomVariation;
    
    // Calculer le stock du mois
    let stock = Math.round(baseStock * stockFactor);
    
    // Simuler des ruptures de stock occasionnelles
    // Plus fréquentes pendant les périodes de forte demande
    const isHighDemandSeason = month === 0 || month === 1 || month === 6 || month === 7;
    const stockoutProbability = isHighDemandSeason ? 0.3 : 0.1;
    const hasStockout = Math.random() < stockoutProbability;
    
    // Nombre de jours en rupture
    const stockouts = hasStockout ? Math.round(Math.random() * 7) + 1 : 0;
    
    // Si rupture, réduire le stock
    if (stockouts > 0) {
      stock = Math.max(0, stock - Math.round(stock * 0.4));
    }
    
    // Calculer la valeur du stock
    const value = parseFloat((stock * avgUnitPrice).toFixed(2));
    
    // Ajouter l'entrée
    result.push({
      date: currentDate.toISOString().split('T')[0], // Format YYYY-MM-DD
      stock,
      value,
      stockouts
    });
    
    // Mettre à jour le stock de base pour le mois suivant
    // Simuler des fluctuations de stock avec restockage
    const restockFactor = 1 + (Math.random() * 0.2 - 0.1); // ±10%
    baseStock = Math.max(15, Math.min(50, stock * restockFactor));
    
    // Passer au mois suivant
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return result;
}