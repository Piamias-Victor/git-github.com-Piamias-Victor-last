// src/components/shared/EnhancedDateRangeSelector.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronDown, FiChevronUp, FiClock, FiRefreshCw } from 'react-icons/fi';
import { PresetRangeOptions, PRESET_RANGES } from './PresetRangeOptions';
import { CustomDateRange } from './CustomDateRange';
import { useDateRange } from '@/providers/DateRangeProvider';
import { formatDateForDisplay } from '@/utils/dateUtils';

export function EnhancedDateRangeSelector() {
  // État du dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'primary' | 'comparison'>('primary');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Récupérer les données du contexte
  const { 
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
  } = useDateRange();

  // États locaux pour la période principale
  const [selectedRange, setSelectedRange] = useState(range);
  const [primaryStartDate, setPrimaryStartDate] = useState(startDate);
  const [primaryEndDate, setPrimaryEndDate] = useState(endDate);
  
  // États locaux pour la période de comparaison
  const [selectedComparisonRange, setSelectedComparisonRange] = useState(comparisonRange || 'previousYear');
  const [compStartDate, setCompStartDate] = useState(comparisonStartDate || '');
  const [compEndDate, setCompEndDate] = useState(comparisonEndDate || '');

  // Initialiser les états locaux quand les valeurs du contexte changent
  useEffect(() => {
    setSelectedRange(range);
    setPrimaryStartDate(startDate);
    setPrimaryEndDate(endDate);
  }, [range, startDate, endDate]);

  useEffect(() => {
    setSelectedComparisonRange(comparisonRange || 'previousYear');
    setCompStartDate(comparisonStartDate || '');
    setCompEndDate(comparisonEndDate || '');
  }, [comparisonRange, comparisonStartDate, comparisonEndDate]);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handlers pour la période principale
  const handleSelectPresetRange = (newRange: string) => {
    setSelectedRange(newRange);
    
    if (newRange !== 'custom') {
      setDateRange(newRange);
      
      // Si on est dans l'onglet principal, on peut fermer le dropdown
      if (activeTab === 'primary') {
        setIsOpen(false);
      }
    }
  };

  const handleApplyCustomRange = () => {
    if (primaryStartDate && primaryEndDate) {
      setDateRange('custom', primaryStartDate, primaryEndDate);
      
      // Si on est dans l'onglet principal, on peut fermer le dropdown
      if (activeTab === 'primary') {
        setIsOpen(false);
      }
    }
  };

  // Handlers pour la période de comparaison
  const handleSelectComparisonRange = (newRange: string) => {
    setSelectedComparisonRange(newRange);
    
    if (newRange !== 'custom') {
      setComparisonDateRange(newRange);
      
      // Si on est dans l'onglet de comparaison, on peut fermer le dropdown
      if (activeTab === 'comparison') {
        setIsOpen(false);
      }
    }
  };

  const handleApplyComparisonRange = () => {
    if (compStartDate && compEndDate) {
      setComparisonDateRange('custom', compStartDate, compEndDate);
      
      // Si on est dans l'onglet de comparaison, on peut fermer le dropdown
      if (activeTab === 'comparison') {
        setIsOpen(false);
      }
    }
  };

  // Options pour la période de comparaison
  const COMPARISON_RANGES = [
    { label: 'Année précédente', value: 'previousYear' },
    { label: 'Période précédente', value: 'previousPeriod' },
    { label: 'Même période n-1', value: 'sameLastYear' },
    { label: 'Même période n-2', value: 'sameLastTwoYears' },
    { label: 'Personnalisé', value: 'custom' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium w-80 justify-between text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
        <FiCalendar className="mr-2" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{displayLabel}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <FiRefreshCw className="mr-1" size={10} /> vs {comparisonDisplayLabel || 'N-1'}
          </span>
        </div>
        {isOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-92 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          {/* Tabs pour naviguer entre période principale et période de comparaison */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('primary')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'primary'
                  ? 'text-indigo-600 border-b-2 border-indigo-500 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <FiCalendar className="mr-2" size={16} />
                Période principale
              </div>
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'comparison'
                  ? 'text-indigo-600 border-b-2 border-indigo-500 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <FiClock className="mr-2" size={16} />
                Comparaison
              </div>
            </button>
          </div>

          {/* Contenu de l'onglet actif */}
          {activeTab === 'primary' ? (
            <>
              <PresetRangeOptions 
                selectedRange={selectedRange} 
                onSelectRange={handleSelectPresetRange} 
              />

              {selectedRange === 'custom' && (
                <CustomDateRange
                  startDate={primaryStartDate}
                  endDate={primaryEndDate}
                  onStartDateChange={setPrimaryStartDate}
                  onEndDateChange={setPrimaryEndDate}
                  onApply={handleApplyCustomRange}
                />
              )}
            </>
          ) : (
            <>
              {/* Options pour la période de comparaison */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Période de comparaison</div>
                <div className="space-y-1">
                  {COMPARISON_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleSelectComparisonRange(range.value)}
                      className={`w-full text-left px-2 py-1 text-sm rounded-md ${
                        selectedComparisonRange === range.value
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates personnalisées pour la comparaison */}
              {selectedComparisonRange === 'custom' && (
                <CustomDateRange
                  startDate={compStartDate}
                  endDate={compEndDate}
                  onStartDateChange={setCompStartDate}
                  onEndDateChange={setCompEndDate}
                  onApply={handleApplyComparisonRange}
                />
              )}
              
              {/* Aperçu des dates de comparaison */}
              {selectedComparisonRange !== 'custom' && comparisonStartDate && comparisonEndDate && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-400">
                  <div className="font-medium mb-1">Période de comparaison:</div>
                  <div>{formatDateForDisplay(comparisonStartDate)} - {formatDateForDisplay(comparisonEndDate)}</div>
                </div>
              )}
            </>
          )}

          {/* Footer avec bouton de fermeture */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}