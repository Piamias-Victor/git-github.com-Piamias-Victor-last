// src/providers/DateRangeProvider/index.tsx
'use client';

import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getDateRangeFromPreset, formatDateForDisplay } from '@/utils/dateUtils';
import { DateRangeContext } from './context';
import { getInitialDateParams, updateLocalStorage } from './utils';
import { PRESET_RANGES } from '@/components/shared/PresetRangeOptions';
import { DateRangeProviderProps } from '../../../types/dateRange';

// Composant interne qui utilise useSearchParams
function DateRangeProviderContent({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<string>('thisMonth');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [displayLabel, setDisplayLabel] = useState<string>('Ce mois');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialiser à partir des paramètres d'URL au chargement ou de localStorage
  useEffect(() => {
    const params = getInitialDateParams(searchParams);
    
    setRange(params.range);
    setDisplayLabel(params.displayLabel);
    
    // Calculer les dates si nécessaire
    if (params.range === 'custom') {
      setStartDate(params.startDate);
      setEndDate(params.endDate);
    } else {
      // Calculer les dates correspondantes à la plage prédéfinie
      const { startDate, endDate } = getDateRangeFromPreset(params.range);
      setStartDate(startDate);
      setEndDate(endDate);
    }
    
    // Toujours stocker la plage actuelle dans localStorage
    localStorage.setItem('apodata_date_range', params.range);
  }, [searchParams]);

  // Fonction pour mettre à jour la plage de dates
  const setDateRange = (newRange: string, start?: string, end?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('range', newRange);
    setRange(newRange);
    
    if (newRange === 'custom' && start && end) {
      // Pour les plages personnalisées
      params.set('startDate', start);
      params.set('endDate', end);
      
      const newLabel = `${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`;
      setDisplayLabel(newLabel);
      
      // Mettre à jour l'état interne
      setStartDate(start);
      setEndDate(end);
      
      // Mettre à jour localStorage
      updateLocalStorage(newRange, start, end, newLabel);
    } else {
      // Pour les plages prédéfinies
      if (params.has('startDate')) params.delete('startDate');
      if (params.has('endDate')) params.delete('endDate');
      
      const preset = PRESET_RANGES.find(p => p.value === newRange);
      if (preset) {
        setDisplayLabel(preset.label);
        updateLocalStorage(newRange, undefined, undefined, preset.label);
      }
      
      // Calculer et mettre à jour les dates correspondantes
      const { startDate, endDate } = getDateRangeFromPreset(newRange);
      setStartDate(startDate);
      setEndDate(endDate);
    }
    
    // Mettre à jour l'URL avec les nouveaux paramètres
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DateRangeContext.Provider value={{ range, startDate, endDate, displayLabel, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

/**
 * Fournisseur pour partager les informations de plage de dates
 * sur l'ensemble de l'application
 */
export function DateRangeProvider({ children }: DateRangeProviderProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement des paramètres de date...</div>}>
      <DateRangeProviderContent>
        {children}
      </DateRangeProviderContent>
    </Suspense>
  );
}

// Exporter le hook pour faciliter l'utilisation
export { useDateRange } from './context';