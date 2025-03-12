import React from 'react';
import { Pharmacy } from './PharmacyResultTable';

interface PharmacyDetailsTabProps {
  pharmacy: Pharmacy;
}

export function PharmacyDetailsTab({ pharmacy }: PharmacyDetailsTabProps) {
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  // Simulation de données détaillées supplémentaires pour la pharmacie
  const additionalDetails = {
    address: "12 Rue de la Pharmacie, 75000 Paris",
    phone: "+33 1 23 45 67 89",
    email: `contact@${pharmacy.name.toLowerCase().replace(/\s+/g, '')}.fr`,
    website: `www.${pharmacy.name.toLowerCase().replace(/\s+/g, '')}.fr`,
    employeesCount: Math.floor(Math.random() * 10) + 3,
    openHours: "Lun-Ven: 9h-19h, Sam: 9h-17h",
    creationDate: "15/06/2010",
    lastUpdate: "08/03/2025",
    customerCount: Math.floor(Math.random() * 5000) + 1000,
    averageBasket: (Math.random() * 30 + 20).toFixed(2)
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
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ID Pharmacie</h4>
            <p className="text-base text-gray-900 dark:text-white">{pharmacy.id}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nom</h4>
            <p className="text-base text-gray-900 dark:text-white">{pharmacy.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Zone</h4>
            <p className="text-base text-gray-900 dark:text-white">{pharmacy.area}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Adresse</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.address}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.phone}</p>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.email}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Site Web</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.website}</p>
          </div>
        </div>
      </div>
      
      {/* Colonne de droite - Statistiques et performances */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performances et Statistiques
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre de produits</h4>
            <p className="text-base text-gray-900 dark:text-white">{pharmacy.products}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Stock total</h4>
            <p className="text-base text-gray-900 dark:text-white">{pharmacy.stock} unités</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Chiffre d'affaires</h4>
            <p className="text-base text-gray-900 dark:text-white">{formatCurrency(pharmacy.revenue)}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Marge totale</h4>
            <p className="text-base text-gray-900 dark:text-white">{formatCurrency(pharmacy.margin)}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Taux de marge</h4>
            <p className={`text-base ${
              Number(pharmacy.marginRate.replace('%', '')) > 25
                ? 'text-green-600 dark:text-green-400'
                : Number(pharmacy.marginRate.replace('%', '')) > 20
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
            }`}>{pharmacy.marginRate}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ventes totales</h4>
            <p className="text-base text-gray-900 dark:text-white">{pharmacy.sales} unités</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Panier moyen</h4>
            <p className="text-base text-gray-900 dark:text-white">{additionalDetails.averageBasket} €</p>
          </div>
        </div>
      </div>
    </div>
  );
}