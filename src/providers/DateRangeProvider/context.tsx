// src/providers/DateRangeProvider/context.tsx
import { createContext, useContext } from 'react';
import { DateRangeContextType } from '../../../types/dateRange';

// Valeurs par défaut
const defaultContext: DateRangeContextType = {
  range: 'thisMonth',
  startDate: '',
  endDate: '',
  displayLabel: 'Ce mois',
  comparisonRange: 'previousYear',
  comparisonStartDate: '',
  comparisonEndDate: '',
  comparisonDisplayLabel: 'N-1',
  setDateRange: () => {},
  setComparisonDateRange: () => {}
};

// Création du contexte
export const DateRangeContext = createContext<DateRangeContextType>(defaultContext);

// Hook personnalisé pour utiliser le contexte
export const useDateRange = () => useContext(DateRangeContext);