import React, { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * Composant d'aide pour la recherche de produits
 * Explique les différentes méthodes de recherche disponibles
 */
export function SearchHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiHelpCircle className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Guide de recherche
          </h3>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p className="mb-3">
            Notre outil de recherche propose plusieurs méthodes pour trouver rapidement les produits que vous recherchez :
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Recherche par nom</h4>
              <p>Saisissez simplement le nom ou une partie du nom du produit (ex: "Doliprane").</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Recherche par code EAN13</h4>
              <p>Entrez le code à barres complet ou partiel (ex: "3400936"). Le système reconnaît automatiquement les chiffres comme un code.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Recherche par fin de code (*)</h4>
              <p>Utilisez un astérisque (*) suivi des derniers chiffres du code pour rechercher par la fin du code EAN13 (ex: "*4578").</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Recherche par liste de codes</h4>
              <p>Cliquez sur "Mode liste de codes" pour coller une liste de codes EAN, séparés par des sauts de ligne, virgules ou points-virgules. Idéal pour rechercher plusieurs produits à la fois.</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-700 dark:text-indigo-300">
            <p className="text-sm font-medium">Astuce</p>
            <p className="text-xs">Les codes incomplets seront automatiquement formatés au format 13 caractères. Le type de recherche est détecté automatiquement en fonction de votre saisie.</p>
          </div>
        </div>
      )}
    </div>
  );
}