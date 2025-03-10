'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import { useDateRange } from '@/providers/DateRangeProvider';
import { PresetRangeOptions } from './PresetRangeOptions';
import { CustomDateRange } from './CustomDateRange';

/**
 * Composant sélecteur de plage de dates global
 * Permet de filtrer les données par période sur l'ensemble du site
 */
export function DateRangeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const searchParams = useSearchParams();
  
  // Utiliser le contexte de plage de dates avec le label d'affichage
  const { range, setDateRange, displayLabel } = useDateRange();

  // Initialiser à partir des paramètres d'URL au chargement
  useEffect(() => {
    const rangeParam = searchParams.get('range');
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    
    if (rangeParam) {
      setSelectedRange(rangeParam);
    } else {
      // Si pas de paramètre dans l'URL, vérifier dans localStorage
      const storedRange = localStorage.getItem('apodata_date_range');
      if (storedRange) {
        setSelectedRange(storedRange);
      }
    }
    
    if (start) setStartDate(start);
    else {
      const storedStart = localStorage.getItem('apodata_start_date');
      if (storedStart) setStartDate(storedStart);
    }
    
    if (end) setEndDate(end);
    else {
      const storedEnd = localStorage.getItem('apodata_end_date');
      if (storedEnd) setEndDate(storedEnd);
    }
    
    // Si on a des dates personnalisées
    if ((start && end) || (localStorage.getItem('apodata_start_date') && localStorage.getItem('apodata_end_date'))) {
      if (!rangeParam || rangeParam === 'custom') {
        setSelectedRange('custom');
      }
    }
  }, [searchParams]);

  // Sélectionner une période prédéfinie
  const handleSelectPresetRange = (range: string) => {
    setSelectedRange(range);
    
    if (range !== 'custom') {
      setDateRange(range);
      setIsOpen(false);
    }
  };

  // Appliquer une plage personnalisée
  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      setDateRange('custom', startDate, endDate);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <FiCalendar className="mr-2" />
        <span>{displayLabel}</span>
        {isOpen ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <PresetRangeOptions 
            selectedRange={selectedRange} 
            onSelectRange={handleSelectPresetRange} 
          />

          {selectedRange === 'custom' && (
            <CustomDateRange
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onApply={handleApplyCustomRange}
            />
          )}
        </div>
      )}
    </div>
  );
}