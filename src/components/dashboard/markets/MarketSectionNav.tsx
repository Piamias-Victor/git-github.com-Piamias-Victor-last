// src/components/markets/MarketSectionNav.tsx
import React from 'react';

interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive = false }) => {
  // Fonction pour le défilement doux
  const smoothScrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    
    if (element) {
      const offset = 100; // Décalage du haut
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Mettre à jour l'URL sans rechargement
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', href);
      }
    }
  };

  return (
    <a 
      href={href}
      onClick={(e) => smoothScrollToAnchor(e, href)}
      className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
          : 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      {label}
    </a>
  );
};

interface MarketSectionNavProps {
  activeSection?: string;
}

export const MarketSectionNav: React.FC<MarketSectionNavProps> = ({ 
  activeSection = 'overview' 
}) => {
  // Sections disponibles
  const sections = [
    { id: 'overview', label: 'Aperçu' },
    { id: 'hierarchy', label: 'Hiérarchie' },
    { id: 'sales', label: 'Ventes' },
    { id: 'evolution', label: 'Évolution' },
    { id: 'seasonal', label: 'Saisonnalité' },
    { id: 'laboratories', label: 'Laboratoires' },
    { id: 'products', label: 'Produits' },
    { id: 'segments', label: 'Segments' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 overflow-x-auto">
      <div className="flex space-x-2">
        {sections.map((section) => (
          <NavLink 
            key={section.id} 
            href={`#${section.id}`} 
            label={section.label} 
            isActive={activeSection === section.id} 
          />
        ))}
      </div>
    </div>
  );
};