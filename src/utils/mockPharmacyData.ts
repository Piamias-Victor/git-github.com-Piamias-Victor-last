import { Pharmacy } from "@/components/dashboard/products/PharmacyResultTable";

// Données simulées pour les pharmacies
export const mockPharmacyData: Pharmacy[] = [
  {
    id: "PHR1245",
    name: "Pharmacie Centrale",
    area: "Paris",
    products: 156,
    stock: 528,
    revenue: 18500,
    margin: 5920,
    marginRate: "32.0%",
    sales: 412
  },
  {
    id: "PHR2387",
    name: "Pharmacie du Marché",
    area: "Lyon",
    products: 128,
    stock: 385,
    revenue: 12750,
    margin: 3825,
    marginRate: "30.0%",
    sales: 285
  },
  {
    id: "PHR3654",
    name: "Pharmacie des Alpes",
    area: "Grenoble", 
    products: 94,
    stock: 273,
    revenue: 9850,
    margin: 2758,
    marginRate: "28.0%",
    sales: 196
  },
  {
    id: "PHR4125",
    name: "Pharmacie du Port",
    area: "Marseille",
    products: 112,
    stock: 356,
    revenue: 14250,
    margin: 4560,
    marginRate: "32.0%",
    sales: 328
  },
  {
    id: "PHR5789",
    name: "Pharmacie Saint Michel",
    area: "Toulouse",
    products: 86,
    stock: 216,
    revenue: 7950,
    margin: 2306,
    marginRate: "29.0%",
    sales: 178
  }
];