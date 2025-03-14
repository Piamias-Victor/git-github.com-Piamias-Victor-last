// src/utils/formatters.ts

/**
 * Formate une valeur monétaire en euros (€)
 * @param value Valeur à formater
 * @returns Chaîne formatée (ex: 1 234,56 €)
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  /**
   * Formate un pourcentage
   * @param value Valeur à formater (ex: 25.5)
   * @param prefixPlus Ajouter un '+' pour les valeurs positives
   * @returns Chaîne formatée (ex: 25,5% ou +25,5%)
   */
  export function formatPercentage(value: number, prefixPlus: boolean = false): string {
    const formattedValue = new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
    
    if (prefixPlus && value > 0) {
      return `+${formattedValue}`;
    }
    
    return formattedValue;
  }
  
  /**
   * Formate une date pour l'affichage
   * @param dateStr Date au format YYYY-MM-DD
   * @returns Date formatée (ex: 31/12/2024)
   */
  export function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }
  
  /**
   * Formate un nombre avec séparateurs de milliers
   * @param value Valeur à formater
   * @returns Chaîne formatée (ex: 1 234)
   */
  export function formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }
  
  /**
   * Abrège un nombre pour l'affichage
   * @param value Valeur à formater
   * @returns Chaîne formatée (ex: 1,2k, 1,5M)
   */
  export function formatCompactNumber(value: number): string {
    if (value < 1000) {
      return value.toString();
    } else if (value < 1000000) {
      return `${(value / 1000).toFixed(1).replace('.0', '')}k`;
    } else {
      return `${(value / 1000000).toFixed(1).replace('.0', '')}M`;
    }
  }
  
  /**
   * Tronque un texte et ajoute des points de suspension si nécessaire
   * @param text Texte à tronquer
   * @param maxLength Longueur maximale
   * @returns Texte tronqué ou original si plus court
   */
  export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  }