// src/utils/dateFormatUtils.ts

/**
 * Formate une date pour l'affichage sur les axes du graphique
 * @param dateStr Date au format YYYY-MM-DD
 * @returns Mois abrégé (ex: "janv.")
 */
export function formatChartDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'short' });
  }
  
  /**
   * Formate une date pour l'affichage dans les tooltips du graphique
   * @param dateStr Date au format YYYY-MM-DD
   * @returns Date complète (ex: "1 janvier 2023")
   */
  export function formatTooltipDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  
  /**
   * Formate une date pour l'affichage dans les textes d'interface
   * @param dateStr Date au format YYYY-MM-DD
   * @returns Date complète (ex: "1 janvier 2023")
   */
  export function formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }