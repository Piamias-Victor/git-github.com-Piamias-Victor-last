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

  // Initialiser à partir des paramètres d'URL au chargement ou de localStorage s'il existe
  useEffect(() => {
    // Vérifier d'abord si nous avons des paramètres stockés dans localStorage
    const storedRange = localStorage.getItem('apodata_date_range');
    const storedStartDate = localStorage.getItem('apodata_start_date');
    const storedEndDate = localStorage.getItem('apodata_end_date');
    const storedDisplayLabel = localStorage.getItem('apodata_display_label');

    // Priorité aux paramètres d'URL s'ils existent
    const rangeParam = searchParams.get('range');
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');

    // Utiliser les paramètres d'URL s'ils existent, sinon localStorage, sinon la valeur par défaut
    const effectiveRange = rangeParam || storedRange || 'thisMonth';
    
    setRange(effectiveRange);
    
    // Mettre à jour le label d'affichage en fonction de la plage
    if (effectiveRange === 'custom' && 
        ((startParam && endParam) || (storedStartDate && storedEndDate))) {
      // Pour les dates personnalisées
      const finalStartDate = startParam || storedStartDate || '';
      const finalEndDate = endParam || storedEndDate || '';
      
      setStartDate(finalStartDate);
      setEndDate(finalEndDate);
      
      const finalLabel = `${formatDateForDisplay(finalStartDate)} - ${formatDateForDisplay(finalEndDate)}`;
      setDisplayLabel(finalLabel);
      
      // Stocker dans localStorage
      localStorage.setItem('apodata_start_date', finalStartDate);
      localStorage.setItem('apodata_end_date', finalEndDate);
      localStorage.setItem('apodata_display_label', finalLabel);
    } else {
      // Pour les plages prédéfinies
      const preset = PRESET_RANGES.find(p => p.value === effectiveRange);
      let finalLabel = '';
      
      if (preset) {
        finalLabel = preset.label;
        setDisplayLabel(finalLabel);
      } else if (storedDisplayLabel) {
        finalLabel = storedDisplayLabel;
        setDisplayLabel(storedDisplayLabel);
      }
      
      // Calculer les dates correspondantes
      const { startDate, endDate } = getDateRangeFromPreset(effectiveRange);
      setStartDate(startDate);
      setEndDate(endDate);
      
      // Stocker dans localStorage
      localStorage.setItem('apodata_display_label', finalLabel);
    }
    
    // Toujours stocker la plage actuelle dans localStorage
    localStorage.setItem('apodata_date_range', effectiveRange);
    
  }, [searchParams]);

  // Fonction pour mettre à jour la plage de dates
  const setDateRange = (newRange: string, start?: string, end?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('range', newRange);
    localStorage.setItem('apodata_date_range', newRange);
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
      
      // Stocker dans localStorage
      localStorage.setItem('apodata_start_date', start);
      localStorage.setItem('apodata_end_date', end);
      localStorage.setItem('apodata_display_label', newLabel);
    } else {
      // Pour les plages prédéfinies
      if (params.has('startDate')) params.delete('startDate');
      if (params.has('endDate')) params.delete('endDate');
      
      // Supprimer du localStorage les dates personnalisées
      localStorage.removeItem('apodata_start_date');
      localStorage.removeItem('apodata_end_date');
      
      const preset = PRESET_RANGES.find(p => p.value === newRange);
      if (preset) {
        setDisplayLabel(preset.label);
        localStorage.setItem('apodata_display_label', preset.label);
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