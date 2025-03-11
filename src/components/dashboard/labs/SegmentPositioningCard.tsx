// src/components/dashboard/labs/visualization/SegmentPositioningCard.tsx
import React from 'react';
import { FiAward, FiTrendingUp, FiPieChart } from 'react-icons/fi';

interface PositioningData {
  segment: string;
  segmentType: 'universe' | 'category' | 'family';
  rank: number;
  totalCompetitors: number;
  marketShare: number;
  leadingCompetitor: string;
  leadingCompetitorShare: number;
  competitors: {
    name: string;
    share: number;
    isMain: boolean;
  }[];
}

interface SegmentPositioningCardProps {
  positioning: PositioningData;
  labName: string;
}

// Mapper le type de segment à un titre lisible
const segmentTypeLabels: Record<string, string> = {
  'universe': 'Univers',
  'category': 'Catégorie',
  'family': 'Famille'
};

export function SegmentPositioningCard({ positioning, labName }: SegmentPositioningCardProps) {
  const isLeader = positioning.rank === 1;
  
  // Générer un tableau de couleurs pour les barres
  const getBarColors = () => {
    return positioning.competitors.map(comp => 
      comp.isMain ? '#4F46E5' : '#E5E7EB'
    );
  };
  
  // Générer un message sur le positionnement
  const getPositioningMessage = () => {
    if (isLeader) {
      return `${labName} est leader sur ${segmentTypeLabels[positioning.segmentType].toLowerCase()} ${positioning.segment} avec ${positioning.marketShare}% de part de marché.`;
    } else if (positioning.rank === 2) {
      const diff = positioning.leadingCompetitorShare - positioning.marketShare;
      return `${labName} est en 2ème position, à ${diff.toFixed(1)}% derrière ${positioning.leadingCompetitor} qui détient ${positioning.leadingCompetitorShare}% de part de marché.`;
    } else {
      return `${labName} est en ${positioning.rank}ème position sur ${positioning.totalCompetitors} laboratoires présents sur ce segment.`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
          <FiPieChart size={20} />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Positionnement sur {segmentTypeLabels[positioning.segmentType].toLowerCase()} <span className="font-semibold">{positioning.segment}</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getPositioningMessage()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isLeader 
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' 
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          }`}>
            {isLeader ? <FiAward size={18} /> : positioning.rank}
          </div>
          <div className="ml-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Classement</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {isLeader ? 'Leader' : `${positioning.rank}/${positioning.totalCompetitors}`}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex items-center justify-center">
            <FiTrendingUp size={18} />
          </div>
          <div className="ml-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Part de marché</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {positioning.marketShare}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphique de parts de marché */}
      <div className="space-y-2 mt-6">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Répartition des parts de marché
        </div>
        
        {positioning.competitors.map((competitor, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className={competitor.isMain ? "font-semibold text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400"}>
                {competitor.name}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{competitor.share}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${competitor.isMain ? 'bg-indigo-600' : 'bg-gray-400 dark:bg-gray-500'}`}
                style={{ width: `${competitor.share}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}