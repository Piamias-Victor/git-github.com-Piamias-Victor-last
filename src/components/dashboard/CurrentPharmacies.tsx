// src/components/dashboard/CurrentPharmacies.tsx (version améliorée)
import { usePharmacySelection } from '@/providers/PharmacyProvider';
import React, { useMemo } from 'react';
import { FiMapPin, FiDollarSign, FiMaximize } from 'react-icons/fi';

// Données simulées des pharmacies (dans une vraie application, elles viendraient d'un API)
const pharmacyData = [
  { id: '1', name: 'Pharmacie Centrale', region: 'Île-de-France', revenue: '> 2M€', size: 'Grande' },
  { id: '2', name: 'Pharmacie du Marché', region: 'Île-de-France', revenue: '1-2M€', size: 'Moyenne' },
  { id: '3', name: 'Pharmacie Lafayette', region: 'Occitanie', revenue: '> 2M€', size: 'Grande' },
  { id: '4', name: 'Pharmacie des Halles', region: 'Bretagne', revenue: '< 1M€', size: 'Petite' },
  { id: '5', name: 'Pharmacie Saint-Michel', region: 'Bretagne', revenue: '1-2M€', size: 'Moyenne' },
  { id: '6', name: 'Grande Pharmacie', region: 'PACA', revenue: '> 2M€', size: 'Grande' },
  { id: '7', name: 'Pharmacie du Port', region: 'PACA', revenue: '1-2M€', size: 'Moyenne' },
  { id: '8', name: 'Pharmacie Mutualiste', region: 'Auvergne-Rhône-Alpes', revenue: '> 2M€', size: 'Grande' },
  { id: '9', name: 'Pharmacie de la Mairie', region: 'Auvergne-Rhône-Alpes', revenue: '< 1M€', size: 'Petite' },
  { id: '10', name: 'Pharmacie du Centre', region: 'Grand Est', revenue: '1-2M€', size: 'Moyenne' },
];

/**
 * Hook personnalisé pour obtenir les informations détaillées sur les pharmacies sélectionnées
 */
export function useSelectedPharmaciesInfo() {
  const { selectedPharmacies, lastFilterType, selectedFilter } = usePharmacySelection();
  
  const pharmacyDetails = useMemo(() => {
    // Filtrer les pharmacies selon les sélections
    const selected = pharmacyData.filter(p => selectedPharmacies.includes(p.id));
    
    // Obtenir les noms pour l'affichage
    const names = selected.map(p => p.name);
    
    // Regrouper par région, chiffre d'affaires et taille
    const regions = [...new Set(selected.map(p => p.region))];
    const revenueBrackets = [...new Set(selected.map(p => p.revenue))];
    const sizes = [...new Set(selected.map(p => p.size))];
    
    // Déterminer le texte d'affichage
    let displayText = '';
    let filterText = '';
    let filterIcon = null;
    
    if (selected.length === 0) {
      displayText = 'Aucune pharmacie sélectionnée';
    } else if (selected.length === pharmacyData.length) {
      displayText = 'Toutes les pharmacies';
    } else {
      // Vérifier si on a appliqué un filtre
      if (lastFilterType !== 'none' && selectedFilter) {
        switch (lastFilterType) {
          case 'region':
            filterText = `Région: ${selectedFilter}`;
            filterIcon = <FiMapPin size={14} />;
            break;
          case 'revenue':
            filterText = `CA: ${selectedFilter}`;
            filterIcon = <FiDollarSign size={14} />;
            break;
          case 'size':
            filterText = `Taille: ${selectedFilter}`;
            filterIcon = <FiMaximize size={14} />;
            break;
        }
        
        displayText = `${selected.length} pharmacies`;
      } else if (selected.length === 1) {
        displayText = selected[0].name;
      } else if (regions.length === 1) {
        displayText = `${selected.length} pharmacies · ${regions[0]}`;
        filterIcon = <FiMapPin size={14} />;
      } else if (revenueBrackets.length === 1) {
        displayText = `${selected.length} pharmacies · ${revenueBrackets[0]}`;
        filterIcon = <FiDollarSign size={14} />;
      } else if (sizes.length === 1) {
        displayText = `${selected.length} pharmacies · ${sizes[0]}`;
        filterIcon = <FiMaximize size={14} />;
      } else {
        displayText = `${selected.length} pharmacies sélectionnées`;
      }
    }
    
    return {
      count: selected.length,
      names,
      displayText,
      filterText,
      filterIcon,
      isAllSelected: selected.length === pharmacyData.length,
      isEmpty: selected.length === 0,
      regions,
      revenueBrackets,
      sizes
    };
  }, [selectedPharmacies, lastFilterType, selectedFilter]);
  
  return pharmacyDetails;
}

/**
 * Composant affichant les pharmacies sélectionnées
 * Utilisé dans les entêtes des pages du dashboard
 */
export function CurrentPharmacies() {
  const pharmacyInfo = useSelectedPharmaciesInfo();

  if (pharmacyInfo.isEmpty) {
    return null;
  }

  return (
    <div className="inline-flex items-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-md text-sm">
      <FiMapPin className="mr-2" size={16} />
      <span>{pharmacyInfo.displayText}</span>
      
      {pharmacyInfo.filterText && (
        <div className="ml-2 pl-2 border-l border-emerald-300 dark:border-emerald-700 flex items-center">
          {pharmacyInfo.filterIcon}
          <span className="ml-1">{pharmacyInfo.filterText}</span>
        </div>
      )}
    </div>
  );
}