'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getDateRangeFromPreset, formatDateForDisplay } from '@/utils/dateUtils';
import { PRESET_RANGES } from '@/components/shared/PresetRangeOptions';

// Type pour le contexte de dates
interface DateRangeContextType {
  range: string;
  startDate: string;
  endDate: string;
  displayLabel: string;
  setDateRange: (range: string, start?: string, end?: string) => void;
}

// Valeurs par défaut
const defaultContext: DateRangeContextType = {
  range: 'thisMonth',
  startDate: '',
  endDate: '',
  displayLabel: 'Ce mois',
  setDateRange: () => {}
};

// Création du contexte
const DateRangeContext = createContext<DateRangeContextType>(defaultContext);

// Hook personnalisé pour utiliser le contexte
export const useDateRange = () => useContext(DateRangeContext);

interface DateRangeProviderProps {
  children: ReactNode;
}

/**
 * Fournisseur pour partager les informations de plage de dates
 * sur l'ensemble de l'application
 */
export function DateRangeProvider({ children }: DateRangeProviderProps) {
  const [range, setRange] = useState<string>('thisMonth');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [displayLabel, setDisplayLabel] = useState<string>('Ce mois');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialiser à partir des paramètres d'URL au chargement
  useEffect(() => {
    const rangeParam = searchParams.get('range') || 'thisMonth';
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    
    setRange(rangeParam);
    
    // Mettre à jour le label d'affichage en fonction de la plage
    if (rangeParam === 'custom' && startParam && endParam) {
      // Pour les dates personnalisées
      setStartDate(startParam);
      setEndDate(endParam);
      setDisplayLabel(`${formatDateForDisplay(startParam)} - ${formatDateForDisplay(endParam)}`);
    } else {
      // Pour les plages prédéfinies
      const preset = PRESET_RANGES.find(p => p.value === rangeParam);
      if (preset) {
        setDisplayLabel(preset.label);
      }
      
      // Calculer les dates correspondantes
      const { startDate, endDate } = getDateRangeFromPreset(rangeParam);
      setStartDate(startDate);
      setEndDate(endDate);
    }
  }, [searchParams]);

  // Fonction pour mettre à jour la plage de dates
  const setDateRange = (newRange: string, start?: string, end?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('range', newRange);
    
    if (newRange === 'custom' && start && end) {
      params.set('startDate', start);
      params.set('endDate', end);
      setDisplayLabel(`${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`);
    } else {
      // Pour les plages prédéfinies
      if (params.has('startDate')) params.delete('startDate');
      if (params.has('endDate')) params.delete('endDate');
      
      const preset = PRESET_RANGES.find(p => p.value === newRange);
      if (preset) {
        setDisplayLabel(preset.label);
      }
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DateRangeContext.Provider value={{ range, startDate, endDate, displayLabel, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}