// src/components/dashboard/labs/tabs/LabDetailsTab.tsx
import React from 'react';
import { Laboratory } from './LabResultTable';

interface LabDetailsTabProps {
  laboratory: Laboratory;
}

/**
 * Onglet affichant les détails d'un laboratoire
 */
export function LabDetailsTab({ laboratory }: LabDetailsTabProps) {
  // Générer des détails supplémentaires fictifs pour la démonstration
  const additionalDetails = {
    adresse: "123 Avenue des Laboratoires, 75000 Paris",
    telephone: "+33 1 23 45 67 89",
    email: "contact@" + laboratory.name.toLowerCase().replace(/\s+/g, '') + ".com",
    siteWeb: "www." + laboratory.name.toLowerCase().replace(/\s+/g, '') + ".com",
    responsable: "Jean Dupont",
    dateCreation: "15/03/1985",
    typeEntreprise: "Multinational",
    specialite: laboratory.products > 100 ? "Généraliste" : "Spécialiste",
    principauxProduits: ["Produit A", "Produit B", "Produit C"],
    zones: ["Europe", "Amérique du Nord", "Asie"]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Colonne de gauche - Informations générales */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations générales
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nom</h4>
            <p className="text-base text-gray-900 dark:text-white">{laboratory.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre de produits</h4>
            <p className="text-base text-gray-900 dark:text-white">{laboratory.products}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Chiffre d'affaires</h4>
            <p className="text-base text-gray-900 dark:text-white">
              {laboratory.revenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Croissance</h4>
            <p className={`text-base ${laboratory.growth.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {laboratory.growth}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Marge moyenne</h4>
            <p className="text-base text-gray-900 dark:text-white">{laboratory.margin}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Spécialité</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.specialite}</p>
          </div>
        </div>
      </div>
      
      {/* Colonne de droite - Coordonnées et détails supplémentaires */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Coordonnées et Informations supplémentaires
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Adresse</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.adresse}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Téléphone</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.telephone}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.email}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Site Web</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.siteWeb}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Responsable</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.responsable}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Principaux marchés</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {additionalDetails.zones.map((zone, index) => (
                <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded text-xs">
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}