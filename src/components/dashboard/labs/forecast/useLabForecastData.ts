// src/components/dashboard/labs/forecast/useLabForecastData.ts
import { useState, useEffect, useMemo } from 'react';
import { Laboratory } from '../LabResultTable';

interface ForecastDataPoint {
  month: number;
  sellOut: number;
  sellIn: number;
  projectedSellOut?: number;
  projectedSellIn?: number;
}

interface AnnualStats {
  currentSellOut: number;
  currentSellIn: number;
  projectedSellOut: number;
  projectedSellIn: number;
  lastYearSellOut: number;
  lastYearSellIn: number;
  lastYearTotalSellOut: number;
  lastYearTotalSellIn: number;
}

export function useLabForecastData(laboratories: Laboratory[]) {
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculer le total des revenus des laboratoires sélectionnés
  const totalRevenue = useMemo(() => {
    return laboratories.reduce(
      (sum, lab) => sum + lab.revenue.sellOut,
      0
    );
  }, [laboratories]);

  // Générer les données de prévision
  useEffect(() => {
    const generateForecastData = async () => {
      if (laboratories.length === 0) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mois actuel (de 1 à 12)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() retourne 0-11
        const currentYear = currentDate.getFullYear();
        
        // Facteurs de saisonnalité simulés pour les ventes mensuelles
        const seasonalityFactors = [
          0.85, // Jan
          0.80, // Feb
          0.90, // Mar
          0.95, // Apr
          1.00, // May
          1.10, // Jun
          1.05, // Jul
          0.90, // Aug
          1.05, // Sep
          1.10, // Oct
          1.15, // Nov
          1.15  // Dec
        ];
        
        // Déterminer le total mensuel moyen
        const totalAnnualRevenue = totalRevenue * 12;
        const monthlySellOutAvg = totalAnnualRevenue / 12;
        
        // Tendance annuelle (simule un taux de croissance)
        const annualTrendFactor = 1.04; // +4% sur l'année
        
        // Variation mensuelle du sell-in par rapport au sell-out 
        // (le sell-in peut être plus ou moins important selon les mois)
        const sellInToSellOutRatio = [
          1.2,  // Jan: achat important en début d'année
          1.1,  // Feb
          1.05, // Mar
          1.0,  // Apr
          0.95, // May
          1.1,  // Jun
          0.9,  // Jul
          0.8,  // Aug: moins d'achats pendant l'été
          1.1,  // Sep: réapprovisionnement après l'été
          1.15, // Oct
          1.2,  // Nov: achats pour les fêtes
          0.9   // Dec: limitation des stocks en fin d'année
        ];
        
        // Générer les données mensuelles
        const data: ForecastDataPoint[] = [];
        
        for (let month = 1; month <= 12; month++) {
          // Facteur de tendance progressive au cours de l'année
          const trendProgress = 1 + ((annualTrendFactor - 1) * (month - 1) / 11);
          
          // Calculer le sell-out mensuel basé sur la saisonnalité et la tendance
          const monthlySellOut = monthlySellOutAvg * seasonalityFactors[month - 1] * trendProgress;
          
          // Calculer le sell-in correspondant
          const monthlySellIn = monthlySellOut * sellInToSellOutRatio[month - 1];
          
          // Pour les mois futurs, les valeurs réelles sont nulles ou indéfinies
          // Mais nous définissons des projections
          if (month <= currentMonth) {
            // Mois passés ou actuels: valeurs réelles avec une légère variation
            const variationFactor = 0.9 + Math.random() * 0.2; // Entre 0.9 et 1.1
            
            data.push({
              month,
              sellOut: Math.round(monthlySellOut * variationFactor),
              sellIn: Math.round(monthlySellIn * variationFactor),
              // Projections identiques aux valeurs réelles pour les mois passés
              projectedSellOut: Math.round(monthlySellOut * variationFactor),
              projectedSellIn: Math.round(monthlySellIn * variationFactor)
            });
          } else {
            // Mois futurs: uniquement des projections
            data.push({
              month,
              sellOut: 0, // Pas de données réelles pour les mois futurs
              sellIn: 0,  // Pas de données réelles pour les mois futurs
              projectedSellOut: Math.round(monthlySellOut),
              projectedSellIn: Math.round(monthlySellIn)
            });
          }
        }
        
        setForecastData(data);
      } catch (err) {
        console.error('Erreur lors de la génération des prévisions:', err);
        setError('Impossible de générer les prévisions annuelles.');
      } finally {
        setIsLoading(false);
      }
    };

    generateForecastData();
  }, [laboratories, totalRevenue]);

  // Calculer les statistiques pour l'année actuelle et l'année précédente
  const annualStats = useMemo(() => {
    if (forecastData.length === 0) {
      return {
        currentSellOut: 0,
        currentSellIn: 0,
        projectedSellOut: 0,
        projectedSellIn: 0,
        lastYearSellOut: 0,
        lastYearSellIn: 0,
        lastYearTotalSellOut: 0,
        lastYearTotalSellIn: 0
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() retourne 0-11
    
    // Calculer les totaux année courante jusqu'au mois actuel
    const currentSellOut = forecastData
      .filter(d => d.month <= currentMonth)
      .reduce((sum, d) => sum + d.sellOut, 0);
    
    const currentSellIn = forecastData
      .filter(d => d.month <= currentMonth)
      .reduce((sum, d) => sum + d.sellIn, 0);
    
    // Calculer les projections pour l'année complète
    const projectedSellOut = forecastData.reduce((sum, d) => {
      // Pour les mois passés, utiliser les valeurs réelles
      if (d.month <= currentMonth) {
        return sum + d.sellOut;
      }
      // Pour les mois futurs, utiliser les projections
      return sum + (d.projectedSellOut || 0);
    }, 0);
    
    const projectedSellIn = forecastData.reduce((sum, d) => {
      if (d.month <= currentMonth) {
        return sum + d.sellIn;
      }
      return sum + (d.projectedSellIn || 0);
    }, 0);
    
    // Simuler les données de l'année précédente (avec un facteur de 0.96 = -4%)
    const lastYearFactor = 0.96;
    
    const lastYearSellOut = forecastData
      .filter(d => d.month <= currentMonth)
      .reduce((sum, d) => sum + (d.sellOut * lastYearFactor), 0);
    
    const lastYearSellIn = forecastData
      .filter(d => d.month <= currentMonth)
      .reduce((sum, d) => sum + (d.sellIn * lastYearFactor), 0);
    
    const lastYearTotalSellOut = forecastData
      .reduce((sum, d) => {
        if (d.month <= currentMonth) {
          return sum + (d.sellOut * lastYearFactor);
        }
        return sum + ((d.projectedSellOut || 0) * lastYearFactor);
      }, 0);
    
    const lastYearTotalSellIn = forecastData
      .reduce((sum, d) => {
        if (d.month <= currentMonth) {
          return sum + (d.sellIn * lastYearFactor);
        }
        return sum + ((d.projectedSellIn || 0) * lastYearFactor);
      }, 0);
    
    return {
      currentSellOut,
      currentSellIn,
      projectedSellOut,
      projectedSellIn,
      lastYearSellOut,
      lastYearSellIn,
      lastYearTotalSellOut,
      lastYearTotalSellIn
    };
  }, [forecastData]);

  return {
    forecastData,
    annualStats,
    isLoading,
    error
  };
}