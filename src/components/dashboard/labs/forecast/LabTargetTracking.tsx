// src/components/dashboard/labs/targets/LabTargetTracking.tsx
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { Laboratory } from '../LabResultTable';
import { Card } from '@/components/ui/Card';
import { useLabTargetData } from './useLabTargetData';

interface LabTargetTrackingProps {
  laboratories: Laboratory[];
}

export function LabTargetTracking({ laboratories }: LabTargetTrackingProps) {
  // Utiliser le hook pour obtenir et manipuler les données d'objectifs
  const { 
    targetData, 
    currentTarget, 
    setNewTarget, 
    targetGap, 
    monthlyProgress, 
    targetStatus, 
    currentTotals 
  } = useLabTargetData(laboratories);
  
  // État local pour la saisie d'un nouvel objectif
  const [targetInput, setTargetInput] = useState('');
  
  // Formater les valeurs monétaires
  const formatCurrency = (value: number | null) => {
    if (value === null) return '0 €';
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };
  
  // Gérer la soumission d'un nouvel objectif
  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(targetInput.replace(/\s+/g, '').replace(',', '.'));
    if (!isNaN(numValue) && numValue > 0) {
      setNewTarget(numValue);
      setTargetInput('');
    }
  };

  // Déterminer les couleurs pour le graphique
  const getBarColor = (isProjected: boolean, isGap: boolean) => {
    if (isGap) return '#EF4444'; // Rouge pour le gap (objectif non atteint)
    if (isProjected) return '#9CA3AF'; // Gris pour les projections
    return '#4F46E5'; // Bleu pour les réalisations
  };

  // Déterminer la couleur de l'indicateur de statut
  const getStatusColor = () => {
    if (targetStatus === 'on-track') return 'text-green-600 dark:text-green-400';
    if (targetStatus === 'at-risk') return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Générer un texte explicatif basé sur le statut actuel
  const getStatusText = () => {
    if (targetStatus === 'on-track') {
      return "Vous êtes en bonne voie pour atteindre votre objectif annuel.";
    }
    if (targetStatus === 'at-risk') {
      return `Votre progression actuelle montre un risque de ne pas atteindre l'objectif. 
              Vous devrez augmenter votre performance mensuelle de ${monthlyProgress.requiredIncrease.toFixed(1)}% 
              pour les mois restants.`;
    }
    return `Votre objectif semble difficile à atteindre. Pour y parvenir, vous devrez augmenter 
            votre performance mensuelle de ${monthlyProgress.requiredIncrease.toFixed(1)}% pour les mois restants.`;
  };

  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Suivi des Objectifs Annuels
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Année {new Date().getFullYear()}
          </div>
        </div>

        {/* Formulaire de saisie d'objectif */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Objectif Annuel</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(currentTarget)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Réalisé à ce jour</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(currentTotals.sellIn)} 
              </div>
            </div>
          </div>
          
          <form onSubmit={handleTargetSubmit} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="Nouvel objectif..."
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500 dark:text-gray-400">
                €
              </span>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Définir
            </button>
          </form>
        </div>

        {/* Statut de progression */}
        <div className={`p-4 rounded-lg mb-6 ${
          targetStatus === 'on-track' 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : targetStatus === 'at-risk' 
              ? 'bg-amber-50 dark:bg-amber-900/20' 
              : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <div className="flex items-start">
            <div className={`p-2 rounded-full ${
              targetStatus === 'on-track' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : targetStatus === 'at-risk' 
                  ? 'bg-amber-100 dark:bg-amber-900/30' 
                  : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <svg className={`w-5 h-5 ${getStatusColor()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {targetStatus === 'on-track' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${getStatusColor()}`}>
                {targetStatus === 'on-track' 
                  ? 'Objectif en bonne voie' 
                  : targetStatus === 'at-risk'
                    ? 'Objectif à risque'
                    : 'Objectif en danger'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {getStatusText()}
              </p>
              <div className="mt-2 flex items-center">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      targetStatus === 'on-track' 
                        ? 'bg-green-500 dark:bg-green-400' 
                        : targetStatus === 'at-risk' 
                          ? 'bg-amber-500 dark:bg-amber-400' 
                          : 'bg-red-500 dark:bg-red-400'
                    }`}
                    style={{ width: `${Math.min(100, monthlyProgress.achievementRate)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(monthlyProgress.achievementRate)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique de progression */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={targetData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                labelFormatter={(label: string) => label}
              />
              <Legend />
              <Bar 
                dataKey="actual" 
                name="Réalisé" 
                stackId="a"
                fill="#4F46E5"
              >
                {targetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(false, false)} />
                ))}
              </Bar>
              <Bar 
                dataKey="projected" 
                name="Prévisionnel" 
                stackId="a"
                fill="#9CA3AF"
              >
                {targetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(true, false)} />
                ))}
              </Bar>
              <Bar 
                dataKey="gap" 
                name="Écart" 
                stackId="a"
                fill="#EF4444"
              >
                {targetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(false, true)} />
                ))}
              </Bar>
              
              {/* Ligne de référence pour l'objectif */}
              <ReferenceLine 
                y={currentTarget} 
                stroke="#F59E0B" 
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: 'Objectif',
                  position: 'right',
                  fill: '#F59E0B',
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Résumé et recommandations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Progression Mensuelle Requise
            </h4>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                {formatCurrency(monthlyProgress.requiredMonthly)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                par mois restant
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {targetGap > 0 
                ? `Il vous reste ${formatCurrency(targetGap)} à réaliser pour atteindre votre objectif annuel.`
                : 'Félicitations ! Vous avez déjà atteint votre objectif annuel.'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Recommandations
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {targetStatus === 'on-track' ? (
                <>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-green-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Maintenez votre rythme actuel de ventes
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-green-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Anticipez les besoins pour les périodes de forte demande
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-amber-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Intensifiez vos actions commerciales ({monthlyProgress.requiredIncrease.toFixed(0)}% de plus)
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-amber-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Concentrez-vous sur les gammes les plus performantes
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-amber-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Envisagez des actions promotionnelles ou incitatifs
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}