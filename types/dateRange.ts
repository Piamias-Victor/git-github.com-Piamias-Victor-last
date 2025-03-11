// src/types/dateRange.ts

import { ReactNode } from "react";

export interface DateRangeContextType {
  // Période principale
  range: string;
  startDate: string;
  endDate: string;
  displayLabel: string;
  
  // Période de comparaison
  comparisonRange: string;
  comparisonStartDate: string;
  comparisonEndDate: string;
  comparisonDisplayLabel: string;
  
  // Méthodes
  setDateRange: (range: string, start?: string, end?: string) => void;
  setComparisonDateRange: (range: string, start?: string, end?: string) => void;
}

export interface DateRangeProviderProps {
  children: ReactNode;
}