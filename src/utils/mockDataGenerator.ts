import { getDaysBetweenDates } from '@/utils/dateUtils';

/**
 * Génère des données journalières simulées sur une période donnée
 * Utile pour les démonstrations et tests
 * 
 * @param startDate Date de début (format YYYY-MM-DD)
 * @param endDate Date de fin (format YYYY-MM-DD)
 * @param baseValue Valeur de base pour les données
 * @param volatility Niveau de variation jour à jour (0-1)
 * @returns Tableau d'objets avec date et valeur pour chaque jour
 */
export function generateDailyMockData(
  startDate: string,
  endDate: string,
  baseValue: number = 100,
  volatility: number = 0.05
): Array<{ date: string; value: number }> {
  const days = getDaysBetweenDates(startDate, endDate);
  const result = [];
  
  let currentValue = baseValue;
  const currentDate = new Date(startDate);
  
  for (let i = 0; i <= days; i++) {
    // Calculer une variation aléatoire entre -volatility et +volatility
    const change = (Math.random() * 2 - 1) * volatility;
    
    // Appliquer la variation à la valeur actuelle
    currentValue = currentValue * (1 + change);
    
    // Formater la date en YYYY-MM-DD
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Ajouter l'entrée au résultat
    result.push({
      date: dateString,
      value: Math.round(currentValue * 100) / 100
    });
    
    // Passer au jour suivant
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}

/**
 * Génère des données simulées par mois sur une période donnée
 * 
 * @param year Année
 * @param baseValue Valeur de base
 * @param trend Tendance annuelle (facteur de croissance)
 * @returns Tableau d'objets avec mois et valeur pour chaque mois
 */
export function generateMonthlyMockData(
  year: number,
  baseValue: number = 100,
  trend: number = 1.02
): Array<{ month: string; value: number }> {
  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];
  
  const result = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < 12; i++) {
    // Appliquer une variation aléatoire mais avec tendance générale
    const monthFactor = 1 + (Math.random() * 0.1 - 0.05); // -5% to +5%
    const trendFactor = Math.pow(trend, i / 12); // Facteur de tendance proportionnel au mois
    
    currentValue = baseValue * monthFactor * trendFactor;
    
    result.push({
      month: monthNames[i],
      value: Math.round(currentValue * 100) / 100
    });
  }
  
  return result;
}