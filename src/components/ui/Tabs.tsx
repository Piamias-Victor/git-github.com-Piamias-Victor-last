// src/components/ui/Tabs.tsx
import React, { useState, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void; // Ajout d'une prop onTabChange
}

export function Tabs({ tabs, defaultTab, onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0].id);

  // Effet pour mettre à jour l'onglet actif quand defaultTab change
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  // Fonction de gestion du clic sur un onglet
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Si onTabChange est défini, l'appeler avec l'ID de l'onglet
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTabContent}
      </div>
    </div>
  );
}