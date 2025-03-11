// src/components/dashboard/products/comparison/types.ts

// Interface pour les données d'une pharmacie dans le graphique radar
export interface PharmacyRadarData {
    name: string;
    price: number;  // % par rapport à la moyenne (100% = prix moyen)
    margin: number; // % par rapport à la moyenne
    rotation: number; // % par rapport à la moyenne
    stock: number; // % par rapport à la moyenne
    sales: number; // % par rapport à la moyenne
  }