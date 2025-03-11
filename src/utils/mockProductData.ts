import { Product } from "../../types/product";

export const mockProductData: Product[] = [
    // Sanofi Products
    {
      id: '1',
      ean: '3400936152786',
      name: 'Doliprane 1000mg Boîte de 8 comprimés',
      laboratory: 'Sanofi',
      category: 'Douleur & Fièvre',
      stock: 42,
      price: '2.18',
      margin: '0.84',
      marginRate: '38.5%',
      sales: 126
    },
    {
      id: '98',
      ean: '3400936152787',
      name: 'Doliprane 500mg Boîte de 8 comprimés',
      laboratory: 'Sanofi',
      category: 'Douleur & Fièvre',
      stock: 21,
      price: '2.18',
      margin: '0.80',
      marginRate: '37.5%',
      sales: 106
    },
    {
      id: '99',
      ean: '3400936152788',
      name: 'Doliprane 500mg Boîte de 8 gellules',
      laboratory: 'Sanofi',
      category: 'Douleur & Fièvre',
      stock: 56,
      price: '2.18',
      margin: '0.86',
      marginRate: '39%',
      sales: 92
    },
    {
      id: '2',
      ean: '3400938101379',
      name: 'Magné B6 Boîte de 60 comprimés',
      laboratory: 'Sanofi',
      category: 'Compléments alimentaires',
      stock: 4,
      price: '9.75',
      margin: '3.12',
      marginRate: '32.0%',
      sales: 18
    },
    {
      id: '3',
      ean: '3400936101456',
      name: 'Euphytose Comprimés',
      laboratory: 'Sanofi',
      category: 'Bien-être & Sommeil',
      stock: 22,
      price: '6.50',
      margin: '1.95',
      marginRate: '30.0%',
      sales: 45
    },
    
  
    // Pfizer Products
    {
      id: '4',
      ean: '3400930025567',
      name: 'Advil 200mg Boîte de 20 comprimés',
      laboratory: 'Pfizer',
      category: 'Anti-inflammatoires',
      stock: 7,
      price: '3.95',
      margin: '1.32',
      marginRate: '33.4%',
      sales: 54
    },
    {
      id: '5',
      ean: '3400939987654',
      name: 'Prevenar 13 Vaccin',
      laboratory: 'Pfizer',
      category: 'Vaccins',
      stock: 15,
      price: '85.50',
      margin: '25.65',
      marginRate: '30.0%',
      sales: 32
    },
    {
      id: '6',
      ean: '3400930456789',
      name: 'Xeljanz 5mg Comprimés',
      laboratory: 'Pfizer',
      category: 'Rhumatologie',
      stock: 10,
      price: '45.75',
      margin: '13.72',
      marginRate: '30.0%',
      sales: 22
    },
  
    // UPSA Products
    {
      id: '7',
      ean: '3400935955838',
      name: 'Efferalgan 500mg 16 comprimés effervescents',
      laboratory: 'UPSA',
      category: 'Douleur & Fièvre',
      stock: 18,
      price: '2.65',
      margin: '0.92',
      marginRate: '34.7%',
      sales: 87
    },
    {
      id: '8',
      ean: '3400935123456',
      name: 'Smecta 3g Poudre 30 sachets',
      laboratory: 'UPSA',
      category: 'Digestion',
      stock: 25,
      price: '4.50',
      margin: '1.35',
      marginRate: '30.0%',
      sales: 65
    },
  
    // Biogaran Products
    {
      id: '9',
      ean: '3400937438483',
      name: 'Amoxicilline Biogaran 500mg Boîte de 12 gélules',
      laboratory: 'Biogaran',
      category: 'Antibiotiques',
      stock: 3,
      price: '6.50',
      margin: '1.85',
      marginRate: '28.5%',
      sales: 32
    },
    {
      id: '10',
      ean: '3400937654321',
      name: 'Méthotrexate Biogaran 2.5mg',
      laboratory: 'Biogaran',
      category: 'Rhumatologie',
      stock: 8,
      price: '15.90',
      margin: '4.77',
      marginRate: '30.0%',
      sales: 25
    },
  
    // Novartis Products
    {
      id: '11',
      ean: '3400938208733',
      name: 'Voltarène Emulgel 1% 100g',
      laboratory: 'Novartis',
      category: 'Anti-inflammatoires',
      stock: 24,
      price: '8.90',
      margin: '2.65',
      marginRate: '29.8%',
      sales: 37
    },
    {
      id: '12',
      ean: '3400938765432',
      name: 'Glivec 400mg Comprimés',
      laboratory: 'Novartis',
      category: 'Oncologie',
      stock: 6,
      price: '75.20',
      margin: '22.56',
      marginRate: '30.0%',
      sales: 15
    },
  
    // Other Products
    {
      id: '13',
      ean: '3400930082676',
      name: 'Smecta 3g Poudre pour suspension buvable 30 sachets',
      laboratory: 'Ipsen',
      category: 'Digestion',
      stock: 15,
      price: '5.75',
      margin: '1.42',
      marginRate: '24.7%',
      sales: 41
    },
    {
      id: '14',
      ean: '3400937851572',
      name: 'Imodium 2mg Boîte de 20 gélules',
      laboratory: 'Janssen',
      category: 'Digestion',
      stock: 12,
      price: '4.85',
      margin: '1.52',
      marginRate: '31.3%',
      sales: 28
    },
    {
      id: '15',
      ean: '3400930085745',
      name: 'Daflon 500mg Boîte de 30 comprimés',
      laboratory: 'Servier',
      category: 'Circulation',
      stock: 2,
      price: '10.95',
      margin: '-0.50',
      marginRate: '-4.6%',
      sales: 49
    },
    {
      id: '16',
      ean: '3400937025423',
      name: 'Nurofen 400mg Boîte de 12 capsules',
      laboratory: 'Reckitt Benckiser',
      category: 'Anti-inflammatoires',
      stock: 67,
      price: '4.25',
      margin: '1.05',
      marginRate: '24.7%',
      sales: 15
    }
  ];