// src/providers/DateRangeProvider/index.tsx
'use client';

import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getDateRangeFromPreset, formatDateForDisplay, getComparisonDateRange } from '@/utils/dateUtils';
import { DateRangeContext } from './context';
import { getInitialDateParams, updateLocalStorage } from './utils';
import { PRESET_RANGES } from '@/components/shared/PresetRangeOptions';
import { DateRangeProviderProps } from '../../../types/dateRange';

// Composant interne qui utilise useSearchParams
function DateRangeProviderContent({ children }: { children: ReactNode }) {
  // États pour la période principale
  const [range, setRange] = useState<string>('thisMonth');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [displayLabel, setDisplayLabel] = useState<string>('Ce mois');
  
  // États pour la période de comparaison
  const [comparisonRange, setComparisonRange] = useState<string>('previousYear');
  const [comparisonStartDate, setComparisonStartDate] = useState<string>('');
  const [comparisonEndDate, setComparisonEndDate] = useState<string>('');
  const [comparisonDisplayLabel, setComparisonDisplayLabel] = useState<string>('N-1');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialiser à partir des paramètres d'URL au chargement ou de localStorage
  useEffect(() => {
    // Récupérer les paramètres pour la période principale
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
    
    // Récupérer les paramètres pour la période de comparaison
    const compParams = searchParams?.get('compRange');
    const compStartParam = searchParams?.get('compStartDate');
    const compEndParam = searchParams?.get('compEndDate');
    
    // Valeurs par défaut si non spécifiées
    let compRange = 'previousYear';
    let compStart = '';
    let compEnd = '';
    let compLabel = 'N-1';
    
    if (compParams) {
      compRange = compParams;
      
      // Récupérer les dates stockées ou les calculer
      if (compParams === 'custom' && compStartParam && compEndParam) {
        compStart = compStartParam;
        compEnd = compEndParam;
        compLabel = `${formatDateForDisplay(compStart)} - ${formatDateForDisplay(compEnd)}`;
      } else {
        // Calculer les dates de comparaison en fonction de la période principale
        const { startDate: compStartDate, endDate: compEndDate, label } = getComparisonDateRange(
          compParams,
          params.range === 'custom' ? params.startDate : startDate,
          params.range === 'custom' ? params.endDate : endDate
        );
        
        compStart = compStartDate;
        compEnd = compEndDate;
        compLabel = label;
      }
    } else {
      // Utiliser les valeurs de localStorage ou calculer les valeurs par défaut
      const storedCompRange = localStorage.getItem('apodata_comparison_range');
      const storedCompStartDate = localStorage.getItem('apodata_comparison_start_date');
      const storedCompEndDate = localStorage.getItem('apodata_comparison_end_date');
      const storedCompLabel = localStorage.getItem('apodata_comparison_display_label');
      
      if (storedCompRange) {
        compRange = storedCompRange;
        
        if (compRange === 'custom' && storedCompStartDate && storedCompEndDate) {
          compStart = storedCompStartDate;
          compEnd = storedCompEndDate;
          compLabel = storedCompLabel || `${formatDateForDisplay(compStart)} - ${formatDateForDisplay(compEnd)}`;
        } else {
          // Calculer les dates de comparaison
          const { startDate: compStartDate, endDate: compEndDate, label } = getComparisonDateRange(
            compRange,
            params.range === 'custom' ? params.startDate : startDate,
            params.range === 'custom' ? params.endDate : endDate
          );
          
          compStart = compStartDate;
          compEnd = compEndDate;
          compLabel = label;
        }
      } else {
        // Calculer les dates de comparaison par défaut (N-1)
        const { startDate: compStartDate, endDate: compEndDate, label } = getComparisonDateRange(
          'previousYear',
          params.range === 'custom' ? params.startDate : startDate,
          params.range === 'custom' ? params.endDate : endDate
        );
        
        compStart = compStartDate;
        compEnd = compEndDate;
        compLabel = label;
      }
    }
    
    setComparisonRange(compRange);
    setComparisonStartDate(compStart);
    setComparisonEndDate(compEnd);
    setComparisonDisplayLabel(compLabel);
    
    // Toujours stocker la plage actuelle dans localStorage
    localStorage.setItem('apodata_date_range', params.range);
  }, [searchParams]);

  // Fonction pour mettre à jour la plage de dates principale
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
    
    // Aussi mettre à jour la période de comparaison si elle n'est pas personnalisée
    if (comparisonRange !== 'custom') {
      const newStartDate = newRange === 'custom' && start ? start : startDate;
      const newEndDate = newRange === 'custom' && end ? end : endDate;
      
      const { startDate: compStartDate, endDate: compEndDate, label } = getComparisonDateRange(
        comparisonRange,
        newStartDate,
        newEndDate
      );
      
      setComparisonStartDate(compStartDate);
      setComparisonEndDate(compEndDate);
      setComparisonDisplayLabel(label);
      
      // Mettre à jour localStorage
      localStorage.setItem('apodata_comparison_start_date', compStartDate);
      localStorage.setItem('apodata_comparison_end_date', compEndDate);
      localStorage.setItem('apodata_comparison_display_label', label);
      
      // Mettre à jour l'URL
      params.set('compRange', comparisonRange);
      params.set('compStartDate', compStartDate);
      params.set('compEndDate', compEndDate);
    }
    
    // Mettre à jour l'URL avec les nouveaux paramètres
    router.push(`${pathname}?${params.toString()}`);
  };

  // Fonction pour mettre à jour la plage de dates de comparaison
  const setComparisonDateRange = (newCompRange: string, start?: string, end?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('compRange', newCompRange);
    setComparisonRange(newCompRange);
    
    // Stocker dans localStorage
    localStorage.setItem('apodata_comparison_range', newCompRange);
    
    if (newCompRange === 'custom' && start && end) {
      // Pour les plages personnalisées
      params.set('compStartDate', start);
      params.set('compEndDate', end);
      
      const newLabel = `${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`;
      setComparisonDisplayLabel(newLabel);
      
      // Mettre à jour l'état interne
      setComparisonStartDate(start);
      setComparisonEndDate(end);
      
      // Mettre à jour localStorage
      localStorage.setItem('apodata_comparison_start_date', start);
      localStorage.setItem('apodata_comparison_end_date', end);
      localStorage.setItem('apodata_comparison_display_label', newLabel);
    } else {
      // Pour les plages prédéfinies calculées
      const { startDate: compStartDate, endDate: compEndDate, label } = getComparisonDateRange(
        newCompRange,
        startDate,
        endDate
      );
      
      // Mettre à jour l'état interne
      setComparisonStartDate(compStartDate);
      setComparisonEndDate(compEndDate);
      setComparisonDisplayLabel(label);
      
      // Mettre à jour l'URL
      params.set('compStartDate', compStartDate);
      params.set('compEndDate', compEndDate);
      
      // Mettre à jour localStorage
      localStorage.setItem('apodata_comparison_start_date', compStartDate);
      localStorage.setItem('apodata_comparison_end_date', compEndDate);
      localStorage.setItem('apodata_comparison_display_label', label);
    }
    
    // Mettre à jour l'URL avec les nouveaux paramètres
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DateRangeContext.Provider value={{ 
      range, 
      startDate, 
      endDate, 
      displayLabel,
      comparisonRange,
      comparisonStartDate,
      comparisonEndDate,
      comparisonDisplayLabel,
      setDateRange,
      setComparisonDateRange
    }}>
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