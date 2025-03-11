// src/providers/DateRangeProvider/utils.ts
import { PRESET_RANGES } from '@/components/shared/PresetRangeOptions';
import { formatDateForDisplay } from '@/utils/dateUtils';

// Obtenir les paramètres de date initiaux (depuis URL ou localStorage)
export function getInitialDateParams(searchParams: URLSearchParams) {
  // Priorité aux paramètres d'URL s'ils existent
  const rangeParam = searchParams.get('range');
  const startParam = searchParams.get('startDate');
  const endParam = searchParams.get('endDate');
  
  // Récupérer depuis localStorage si non présent dans l'URL
  const storedRange = localStorage.getItem('apodata_date_range');
  const storedStartDate = localStorage.getItem('apodata_start_date');
  const storedEndDate = localStorage.getItem('apodata_end_date');
  const storedDisplayLabel = localStorage.getItem('apodata_display_label');

  // Utiliser les paramètres d'URL s'ils existent, sinon localStorage, sinon la valeur par défaut
  const effectiveRange = rangeParam || storedRange || 'thisMonth';
  
  // Pour les dates personnalisées
  let finalStartDate = '';
  let finalEndDate = '';
  let finalLabel = '';
  
  if (effectiveRange === 'custom' && 
      ((startParam && endParam) || (storedStartDate && storedEndDate))) {
    finalStartDate = startParam || storedStartDate || '';
    finalEndDate = endParam || storedEndDate || '';
    
    finalLabel = `${formatDateForDisplay(finalStartDate)} - ${formatDateForDisplay(finalEndDate)}`;
  } else {
    // Pour les plages prédéfinies
    const preset = PRESET_RANGES.find(p => p.value === effectiveRange);
    
    if (preset) {
      finalLabel = preset.label;
    } else if (storedDisplayLabel) {
      finalLabel = storedDisplayLabel;
    }
  }
  
  return {
    range: effectiveRange,
    startDate: finalStartDate,
    endDate: finalEndDate,
    displayLabel: finalLabel
  };
}

// Mettre à jour les paramètres dans localStorage
export function updateLocalStorage(range: string, startDate?: string, endDate?: string, displayLabel?: string) {
  localStorage.setItem('apodata_date_range', range);
  
  if (range === 'custom' && startDate && endDate) {
    localStorage.setItem('apodata_start_date', startDate);
    localStorage.setItem('apodata_end_date', endDate);
    
    if (displayLabel) {
      localStorage.setItem('apodata_display_label', displayLabel);
    }
  } else {
    // Supprimer du localStorage les dates personnalisées
    localStorage.removeItem('apodata_start_date');
    localStorage.removeItem('apodata_end_date');
    
    if (displayLabel) {
      localStorage.setItem('apodata_display_label', displayLabel);
    }
  }
}