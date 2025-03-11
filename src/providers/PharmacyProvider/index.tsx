// src/providers/PharmacyProvider/index.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Définition des types pour le contexte
interface PharmacyContextType {
  selectedPharmacies: string[];
  setPharmacies: (pharmacyIds: string[]) => void;
  lastFilterType: 'region' | 'revenue' | 'size' | 'none';
  setLastFilterType: (type: 'region' | 'revenue' | 'size' | 'none') => void;
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
}

// Création du contexte avec des valeurs par défaut
const PharmacyContext = createContext<PharmacyContextType>({
  selectedPharmacies: [],
  setPharmacies: () => {},
  lastFilterType: 'none',
  setLastFilterType: () => {},
  selectedFilter: null,
  setSelectedFilter: () => {}
});

// Hook personnalisé pour utiliser le contexte
export const usePharmacySelection = () => useContext(PharmacyContext);

interface PharmacyProviderProps {
  children: ReactNode;
}

// Composant principal qui utilise useSearchParams
function PharmacyProviderContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'region' | 'revenue' | 'size' | 'none'>('none');
  const [filterValue, setFilterValue] = useState<string | null>(null);

  // Initialiser à partir des paramètres d'URL au chargement
  useEffect(() => {
    const pharmacyParam = searchParams?.get('pharmacies');
    const filterTypeParam = searchParams?.get('filterType') as 'region' | 'revenue' | 'size' | 'none' | null;
    const filterValueParam = searchParams?.get('filterValue');
    
    if (pharmacyParam) {
      setSelectedPharmacies(pharmacyParam.split(','));
    } else {
      // Si pas de paramètre dans l'URL, vérifier dans localStorage
      const storedPharmacies = localStorage.getItem('apodata_selected_pharmacies');
      if (storedPharmacies) {
        setSelectedPharmacies(JSON.parse(storedPharmacies));
      } else {
        // Par défaut, sélectionner toutes les pharmacies
        // Dans une vraie application, on pourrait charger les IDs depuis un API
        setSelectedPharmacies(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      }
    }
    
    // Récupérer le type de filtre
    if (filterTypeParam) {
      setFilterType(filterTypeParam);
    } else {
      const storedFilterType = localStorage.getItem('apodata_filter_type');
      if (storedFilterType) {
        setFilterType(storedFilterType as 'region' | 'revenue' | 'size' | 'none');
      }
    }
    
    // Récupérer la valeur du filtre
    if (filterValueParam) {
      setFilterValue(filterValueParam);
    } else {
      const storedFilterValue = localStorage.getItem('apodata_filter_value');
      if (storedFilterValue) {
        setFilterValue(storedFilterValue);
      }
    }
  }, [searchParams]);

  // Mettre à jour les pharmacies sélectionnées
  const setPharmacies = (pharmacyIds: string[]) => {
    setSelectedPharmacies(pharmacyIds);
    
    // Mettre à jour localStorage
    localStorage.setItem('apodata_selected_pharmacies', JSON.stringify(pharmacyIds));
    
    // Mettre à jour l'URL
    const params = new URLSearchParams(searchParams?.toString());
    if (pharmacyIds.length > 0) {
      params.set('pharmacies', pharmacyIds.join(','));
    } else {
      params.delete('pharmacies');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Mettre à jour le type de filtre
  const updateFilterType = (type: 'region' | 'revenue' | 'size' | 'none') => {
    setFilterType(type);
    localStorage.setItem('apodata_filter_type', type);
    
    // Mettre à jour l'URL
    const params = new URLSearchParams(searchParams?.toString());
    if (type !== 'none') {
      params.set('filterType', type);
    } else {
      params.delete('filterType');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Mettre à jour la valeur du filtre
  const updateFilterValue = (filter: string | null) => {
    setFilterValue(filter);
    
    if (filter) {
      localStorage.setItem('apodata_filter_value', filter);
      
      // Mettre à jour l'URL
      const params = new URLSearchParams(searchParams?.toString());
      params.set('filterValue', filter);
      router.push(`${pathname}?${params.toString()}`);
    } else {
      localStorage.removeItem('apodata_filter_value');
      
      // Mettre à jour l'URL
      const params = new URLSearchParams(searchParams?.toString());
      params.delete('filterValue');
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <PharmacyContext.Provider 
      value={{ 
        selectedPharmacies, 
        setPharmacies, 
        lastFilterType: filterType, 
        setLastFilterType: updateFilterType, 
        selectedFilter: filterValue, 
        setSelectedFilter: updateFilterValue 
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
}

// Composant Provider enveloppé avec Suspense
export function PharmacyProvider({ children }: PharmacyProviderProps) {
  return (
    <PharmacyProviderContent>
      {children}
    </PharmacyProviderContent>
  );
}