import React, { useEffect, useRef } from 'react';
import { Pharmacy } from './PharmacyResultTable';
import { FiMapPin, FiUsers, FiBriefcase, FiHome } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PharmacyMapTabProps {
  pharmacy: Pharmacy;
}

export function PharmacyMapTab({ pharmacy }: PharmacyMapTabProps) {
  // Référence pour la carte
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Générer des données simulées de localisation et démographie
  const generateLocationData = () => {
    // Adresse simulée en fonction de la zone
    let address = "";
    let coordinates = { lat: 0, lng: 0 };
    let population = 0;
    let competitors = 0;
    let demographics = { young: 0, adult: 0, senior: 0 };
    
    switch (pharmacy.area) {
      case 'Paris':
        address = "12 Rue de Rivoli, 75001 Paris";
        coordinates = { lat: 48.856614, lng: 2.3522219 };
        population = 2140526;
        competitors = 7;
        demographics = { young: 18, adult: 62, senior: 20 };
        break;
      case 'Lyon':
        address = "45 Rue de la République, 69002 Lyon";
        coordinates = { lat: 45.764043, lng: 4.835659 };
        population = 516092;
        competitors = 4;
        demographics = { young: 22, adult: 58, senior: 20 };
        break;
      case 'Marseille':
        address = "56 La Canebière, 13001 Marseille";
        coordinates = { lat: 43.296482, lng: 5.36978 };
        population = 870731;
        competitors = 5;
        demographics = { young: 20, adult: 55, senior: 25 };
        break;
      case 'Toulouse':
        address = "12 Place du Capitole, 31000 Toulouse";
        coordinates = { lat: 43.604652, lng: 1.444209 };
        population = 479553;
        competitors = 3;
        demographics = { young: 25, adult: 56, senior: 19 };
        break;
      case 'Grenoble':
        address = "8 Place Grenette, 38000 Grenoble";
        coordinates = { lat: 45.188529, lng: 5.724524 };
        population = 158180;
        competitors = 2;
        demographics = { young: 24, adult: 53, senior: 23 };
        break;
      default:
        address = "10 Rue Principale, 75000 France";
        coordinates = { lat: 46.603354, lng: 1.888334 };
        population = 500000;
        competitors = 3;
        demographics = { young: 20, adult: 60, senior: 20 };
    }
    
    return { address, coordinates, population, competitors, demographics };
  };

  const locationData = generateLocationData();

  // Initialiser la carte lorsque le composant est monté
  useEffect(() => {
    // Corrige l'icône qui n'apparaît pas par défaut
    // Utiliser une assertion de type pour contourner la vérification TypeScript
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    if (mapContainerRef.current && !mapRef.current) {
      // Créer la carte
      const map = L.map(mapContainerRef.current).setView(
        [locationData.coordinates.lat, locationData.coordinates.lng], 
        14
      );
      
      // Ajouter la couche de tuiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Ajouter un marqueur pour la pharmacie
      const marker = L.marker([locationData.coordinates.lat, locationData.coordinates.lng])
        .addTo(map)
        .bindPopup(`<b>${pharmacy.name}</b><br>${locationData.address}`)
        .openPopup();
      
      // Ajouter un cercle pour montrer la zone d'influence (1km)
      const circle = L.circle([locationData.coordinates.lat, locationData.coordinates.lng], {
        color: '#4F46E5',
        fillColor: '#818CF8',
        fillOpacity: 0.2,
        radius: 1000
      }).addTo(map);
      
      // Stocker la référence de la carte
      mapRef.current = map;
      
      // Simuler des emplacements de concurrents
      for (let i = 0; i < locationData.competitors; i++) {
        // Générer des coordonnées aléatoires dans un rayon de 1km
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 1000;
        const dx = distance * Math.cos(angle) / 111320; // Conversion approximative en degrés (1 deg ≈ 111.32 km)
        const dy = distance * Math.sin(angle) / (111320 * Math.cos(locationData.coordinates.lat * Math.PI / 180));
        
        const competitorLat = locationData.coordinates.lat + dx;
        const competitorLng = locationData.coordinates.lng + dy;
        
        // Ajouter un marqueur pour le concurrent
        L.marker([competitorLat, competitorLng], {
          icon: L.divIcon({
            className: 'competitor-marker',
            html: `<div style="width: 12px; height: 12px; background-color: #EF4444; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })
        }).addTo(map)
        .bindPopup(`Pharmacie concurrente #${i+1}`);
      }
    }
    
    // Nettoyer lors du démontage du composant
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pharmacy.name, locationData]);

  return (
    <div>
      {/* Carte réelle avec Leaflet */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 relative">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Localisation de la pharmacie {pharmacy.name}
        </h3>
        
        <div ref={mapContainerRef} className="h-96 rounded-lg" />
        
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md max-w-xs z-[400]">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
            {pharmacy.name}
          </h4>
          <div className="text-gray-600 dark:text-gray-300 text-xs">
            {locationData.address}
          </div>
        </div>
      </div>
      
      {/* Informations de localisation et données démographiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations de localisation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Informations de localisation
          </h3>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiMapPin className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Adresse</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{locationData.address}</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiUsers className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Population</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {locationData.population.toLocaleString()} habitants dans l'agglomération
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiBriefcase className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Concurrence</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {locationData.competitors} pharmacies concurrentes dans un rayon de 1km
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiHome className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Zone</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {pharmacy.area} - Zone {locationData.population > 1000000 ? "urbaine dense" : locationData.population > 500000 ? "urbaine" : "périurbaine"}
                </p>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Données démographiques */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Données démographiques
          </h3>
          
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Répartition par âge
            </h4>
            <div className="h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div className="flex h-full">
                <div 
                  className="bg-blue-400 dark:bg-blue-500" 
                  style={{ width: `${locationData.demographics.young}%` }}
                  title={`Jeunes: ${locationData.demographics.young}%`}
                ></div>
                <div 
                  className="bg-indigo-500 dark:bg-indigo-600" 
                  style={{ width: `${locationData.demographics.adult}%` }}
                  title={`Adultes: ${locationData.demographics.adult}%`}
                ></div>
                <div 
                  className="bg-purple-500 dark:bg-purple-600" 
                  style={{ width: `${locationData.demographics.senior}%` }}
                  title={`Seniors: ${locationData.demographics.senior}%`}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
              <div>Jeunes: {locationData.demographics.young}%</div>
              <div>Adultes: {locationData.demographics.adult}%</div>
              <div>Seniors: {locationData.demographics.senior}%</div>
            </div>
          </div>
          
          {/* Données d'opportunité commerciale */}
          <div className="mt-6">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Potentiel commercial
            </h4>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Basé sur l'analyse démographique et la concurrence locale:
              </p>
              <ul className="space-y-2 text-sm">
                {locationData.demographics.senior > 22 && (
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-300">Fort potentiel pour les produits seniors</span>
                  </li>
                )}
                
                {locationData.demographics.young > 22 && (
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-300">Fort potentiel pour les produits pédiatriques</span>
                  </li>
                )}
                
                {locationData.competitors < 3 && (
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-300">Concurrence limitée - opportunité d'expansion</span>
                  </li>
                )}
                
                {locationData.competitors > 5 && (
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-300">Concurrence élevée - stratégie de différenciation recommandée</span>
                  </li>
                )}
                
                {locationData.population > 1000000 && (
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-300">Zone à forte densité - opportunité pour services élargis</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}