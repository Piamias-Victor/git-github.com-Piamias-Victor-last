import React from 'react';
import { FiGrid, FiLayers, FiBox, FiTag, FiBookmark } from 'react-icons/fi';

interface SegmentType {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
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
    { 
      value: 'universe', 
      label: 'Univers',
      icon: <FiGrid size={18} />,
      description: 'Grands domaines du marché (ex: Médicaments, Parapharmacie)'
    },
    { 
      value: 'category', 
      label: 'Catégories',
      icon: <FiLayers size={18} />,
      description: 'Segments principaux dans chaque univers (ex: Douleur & Fièvre)'
    },
    { 
      value: 'sub_category', 
      label: 'Sous-catégories',
      icon: <FiBox size={18} />,
      description: 'Segments spécifiques dans chaque catégorie (ex: Antipyrétiques)'
    },
    { 
      value: 'family', 
      label: 'Familles',
      icon: <FiTag size={18} />,
      description: 'Regroupements de produits similaires (ex: Paracétamol)'
    },
    { 
      value: 'sub_family', 
      label: 'Sous-familles',
      icon: <FiBookmark size={18} />,
      description: 'Regroupements spécifiques dans une famille (ex: Paracétamol effervescent)'
    },
    { 
      value: 'specificity', 
      label: 'Spécificités',
      icon: <FiTag size={18} />,
      description: 'Caractéristiques transversales (ex: Enfants, Seniors)'
    }
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Sélectionner le type de segment à analyser
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {segmentTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`p-3 rounded-lg text-left transition-colors border ${
              selectedType === type.value
                ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${
                selectedType === type.value
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {type.icon}
              </div>
              <div>
                <div className={`font-medium ${
                  selectedType === type.value
                    ? 'text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {type.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {type.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};