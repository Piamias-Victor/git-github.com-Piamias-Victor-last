// src/components/markets/SegmentTypeSelector.tsx
import React from 'react';

interface SegmentType {
  value: string;
  label: string;
}

interface SegmentTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export const SegmentTypeSelector: React.FC<SegmentTypeSelectorProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  // Types de segments disponibles
  const segmentTypes: SegmentType[] = [
    { value: 'universe', label: 'Univers' },
    { value: 'category', label: 'Catégories' },
    { value: 'sub_category', label: 'Sous-catégories' },
    { value: 'family', label: 'Familles' },
    { value: 'sub_family', label: 'Sous-familles' },
    { value: 'specificity', label: 'Spécificités' },
    { value: 'lab_distributor', label: 'Distributeurs' },
    { value: 'brand_lab', label: 'Laboratoires' },
    { value: 'range_name', label: 'Gammes' }
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Sélectionner le type de segment à analyser
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {segmentTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              selectedType === type.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
      
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
        Le choix du type de segment modifie l'approche d'analyse et la granularité des données.
      </p>
    </div>
  );
};