/**
 * Utilitaires pour la navigation avec conservation des paramètres de date
 */
import { useMemo } from 'react';
import { useDateRange } from '@/providers/DateRangeProvider';

/**
 * Crée une URL avec les paramètres de date actuels
 * 
 * @param baseUrl L'URL de base à utiliser
 * @param rangePredefined Plage optionnelle à utiliser au lieu de celle stockée
 * @returns Une URL complète avec les paramètres de date
 */
export function createUrlWithCurrentDateParams(baseUrl: string, rangePredefined?: string): string {
  if (typeof window === 'undefined') {
    return baseUrl; // Si code exécuté côté serveur
  }
  
  // Récupérer les paramètres de date depuis localStorage
  const range = rangePredefined || localStorage.getItem('apodata_date_range') || 'thisMonth';
  
  // Commencer à construire l'URL avec le paramètre de plage
  let url = `${baseUrl}?range=${range}`;
  
  // Pour les dates personnalisées, ajouter startDate et endDate
  if (range === 'custom') {
    const startDate = localStorage.getItem('apodata_start_date');
    const endDate = localStorage.getItem('apodata_end_date');
    
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
  }
  
  return url;
}

/**
 * Hook personnalisé pour générer des URLs avec les paramètres de date actuels
 * à utiliser dans les composants React
 */
export function useUrlWithDateParams() {
  const { range, startDate, endDate } = useDateRange();
  
  return useMemo(() => ({
    /**
     * Génère une URL avec les paramètres de date actuels du contexte
     */
    getUrl: (path: string) => {
      let url = `${path}?range=${range}`;
      
      if (range === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      return url;
    }
  }), [range, startDate, endDate]);
}