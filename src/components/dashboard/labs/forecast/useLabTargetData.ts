// src/components/dashboard/labs/targets/useLabTargetData.ts
import { useState, useEffect, useMemo } from 'react';
import { Laboratory } from '../LabResultTable';

interface TargetDataPoint {
  name: string;
  actual: number;
  projected: number;
  gap: number;
}

interface MonthlyProgress {
  achievementRate: number;
  requiredMonthly: number;
  requiredIncrease: number;
}

interface CurrentTotals {
  sellIn: number;
  sellOut: number;
}

export function useLabTargetData(laboratories: Laboratory[]) {
  // État pour stocker l'objectif actuel
  const [currentTarget, setCurrentTarget] = useState<number | null>(null);
  const [targetData, setTargetData] = useState<TargetDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculer le total des revenus des laboratoires sélectionnés
  const totalRevenue = useMemo(() => {
    return laboratories.reduce(
      (sum, lab) => sum + lab.revenue.sellIn,
      0
    );
  }, [laboratories]);

  // Définir l'objectif par défaut au premier chargement
  useEffect(() => {
    if (laboratories.length > 0 && currentTarget === null) {
      // Définir un objectif par défaut basé sur le sell-in actuel
      // Objectif = sell-in annualisé + 10%
      const annualizedSellIn = totalRevenue * 12;
      const defaultTarget = Math.round(annualizedSellIn * 1.1);
      setCurrentTarget(defaultTarget);
    }
  }, [laboratories, totalRevenue, currentTarget]);

  // Mettre à jour les données d'objectif lorsque l'objectif change
  useEffect(() => {
    if (currentTarget === null || laboratories.length === 0) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Récupérer le mois actuel (0-11)
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Récupérer le nombre de mois restants dans l'année
      const remainingMonths = 11 - currentMonth;
      
      // Définir des catégories pour notre graphique
      const categories = [
        'Réalisé à ce jour',
        'Projection',
        'Écart'
      ];
      
      // Calculer les totaux réalisés et projetés
      // Dans un cas réel, ces données viendraient de l'API
      // Pour la démo, nous simulons les données
      
      // Supposons un montant sell-in total pour l'année précédente
      const previousYearSellIn = totalRevenue * 10; // Exemple : 10 mois de revenus actuels
      
      // Calcul du sell-in réalisé jusqu'à présent (proportionnel aux mois écoulés)
      const actualSellIn = Math.round(totalRevenue); // La valeur actuelle des laboratoires est déjà notre "total réalisé"
      
      // Projection simple pour le reste de l'année (tendance constante)
      const monthlyAvg = actualSellIn / (currentMonth + 1);
      const projectedRemainder = monthlyAvg * remainingMonths;
      
      // Total projeté pour l'année
      const totalProjected = actualSellIn + projectedRemainder;
      
      // Écart par rapport à l'objectif
      const gap = Math.max(0, currentTarget - totalProjected);
      
      // Construire les données pour le graphique
      const graphData: TargetDataPoint[] = [
        {
          name: categories[0],
          actual: actualSellIn,
          projected: 0,
          gap: 0
        },
        {
          name: categories[1],
          actual: 0,
          projected: Math.round(projectedRemainder),
          gap: 0
        },
        {
          name: categories[2],
          actual: 0,
          projected: 0,
          gap
        }
      ];
      
      setTargetData(graphData);
    } catch (err) {
      console.error('Erreur lors de la génération des données d\'objectif:', err);
      setError('Impossible de générer les données d\'objectif.');
    } finally {
      setIsLoading(false);
    }
  }, [currentTarget, laboratories, totalRevenue]);

  // Calculer l'écart entre la réalisation actuelle et l'objectif
  const targetGap = useMemo(() => {
    if (!currentTarget || !targetData.length) return 0;
    
    // L'écart est le montant qui reste à réaliser pour atteindre l'objectif
    const actualSellIn = targetData[0]?.actual || 0;
    return Math.max(0, currentTarget - actualSellIn);
  }, [currentTarget, targetData]);

  // Calculer les totaux actuels (réel sell-in/sell-out)
  const currentTotals = useMemo(() => {
    if (laboratories.length === 0) {
      return { sellIn: 0, sellOut: 0 };
    }
    
    const sellIn = totalRevenue;
    const sellOut = laboratories.reduce(
      (sum, lab) => sum + lab.revenue.sellOut,
      0
    );
    
    return { sellIn, sellOut };
  }, [laboratories, totalRevenue]);

  // Calculer la progression mensuelle requise pour atteindre l'objectif
  const monthlyProgress = useMemo(() => {
    if (!currentTarget || laboratories.length === 0) {
      return { achievementRate: 0, requiredMonthly: 0, requiredIncrease: 0 };
    }
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const remainingMonths = 11 - currentMonth;
    
    // Taux de réalisation actuel (pourcentage de l'objectif déjà atteint)
    const actualSellIn = currentTotals.sellIn;
    const achievementRate = (actualSellIn / currentTarget) * 100;
    
    // Montant mensuel moyen réalisé jusqu'à présent
    const monthlyAvg = actualSellIn / (currentMonth + 1);
    
    // Montant mensuel requis pour les mois restants pour atteindre l'objectif
    let requiredMonthly = 0;
    let requiredIncrease = 0;
    
    if (remainingMonths > 0) {
      requiredMonthly = targetGap / remainingMonths;
      // Augmentation requise par rapport à la moyenne mensuelle actuelle
      requiredIncrease = ((requiredMonthly / monthlyAvg) - 1) * 100;
    }
    
    return {
      achievementRate,
      requiredMonthly,
      requiredIncrease: Math.max(0, requiredIncrease) // Ne pas afficher de valeur négative
    };
  }, [currentTarget, laboratories, targetGap, currentTotals]);

  // Déterminer le statut de l'objectif
  const targetStatus = useMemo(() => {
    if (!monthlyProgress) return 'at-risk';
    
    const { achievementRate, requiredIncrease } = monthlyProgress;
    
    // Si plus de 95% réalisé ou pas besoin d'augmentation, on est en bonne voie
    if (achievementRate >= 95 || requiredIncrease === 0) {
      return 'on-track';
    }
    
    // Si l'augmentation requise est entre 0 et 30%, objectif à risque
    if (requiredIncrease <= 30) {
      return 'at-risk';
    }
    
    // Sinon, objectif en danger
    return 'off-track';
  }, [monthlyProgress]);

  // Fonction pour définir un nouvel objectif
  const setNewTarget = (target: number) => {
    setCurrentTarget(target);
  };

  return {
    targetData,
    currentTarget,
    setNewTarget,
    targetGap,
    monthlyProgress,
    targetStatus,
    currentTotals,
    isLoading,
    error
  };
}