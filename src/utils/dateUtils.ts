/**
 * Utilitaires pour la gestion des dates et périodes
 */

/**
 * Obtient les dates de début et de fin pour une période prédéfinie
 */
export function getDateRangeFromPreset(preset: string): { startDate: string, endDate: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endDate = new Date(today);
  let startDate = new Date(today);
  
  switch (preset) {
    case 'today':
      // startDate est déjà aujourd'hui
      break;
      
    case 'thisWeek':
      // Calcul du premier jour de la semaine (lundi)
      const day = today.getDay();
      const diff = day === 0 ? 6 : day - 1; // Ajustement pour que lundi soit le premier jour
      startDate.setDate(today.getDate() - diff);
      break;
      
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
      
    case 'last3Months':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 3);
      break;
      
    case 'last6Months':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 6);
      break;
      
    case 'thisYear':
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
      
    default:
      // Pour 'custom' ou autres, on retourne les dates actuelles
      break;
  }
  
  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate)
  };
}

/**
 * Formate une date pour l'API (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formate une date pour l'affichage (DD/MM/YYYY)
 */
export function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    // Fallback au format simple si la conversion échoue
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
}

/**
 * Vérifie si une date est dans une plage donnée
 */
export function isDateInRange(date: Date, startDateStr: string, endDateStr: string): boolean {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  return date >= startDate && date <= endDate;
}

/**
 * Calcule la différence en jours entre deux dates
 */
export function getDaysBetweenDates(startDateStr: string, endDateStr: string): number {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const differenceInTime = endDate.getTime() - startDate.getTime();
  return Math.round(differenceInTime / (1000 * 3600 * 24));
}