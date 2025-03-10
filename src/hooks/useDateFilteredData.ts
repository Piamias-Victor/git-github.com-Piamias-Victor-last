import { useState, useEffect } from 'react';
import { useDateRange } from '@/providers/DateRangeProvider';
import { isDateInRange } from '@/utils/dateUtils';

/**
 * Hook pour filtrer des données en fonction de la plage de dates sélectionnée
 * 
 * @param data Tableau de données à filtrer
 * @param dateField Nom du champ contenant la date dans les objets (par défaut 'date')
 * @returns Données filtrées selon la plage de dates actuelle
 */
export function useDateFilteredData<T>(
  data: T[],
  dateField: keyof T = 'date' as keyof T
): T[] {
  const { startDate, endDate } = useDateRange();
  const [filteredData, setFilteredData] = useState<T[]>([]);

  useEffect(() => {
    if (!data || data.length === 0 || !startDate || !endDate) {
      setFilteredData(data);
      return;
    }

    // Filtrer les données selon la plage de dates
    const filtered = data.filter(item => {
      const itemDate = item[dateField];
      
      // Vérifier que la date est valide et la convertir si nécessaire
      if (!itemDate) return false;
      
      const date = typeof itemDate === 'string' 
        ? new Date(itemDate) 
        : itemDate instanceof Date 
          ? itemDate 
          : null;
      
      if (!date) return false;
      
      return isDateInRange(date, startDate, endDate);
    });

    setFilteredData(filtered);
  }, [data, dateField, startDate, endDate]);

  return filteredData;
}