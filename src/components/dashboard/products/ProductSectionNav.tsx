// src/components/dashboard/products/ProductSectionNav.tsx
import React from 'react';
import { smoothScrollToAnchor } from '@/utils/scrollUtils';

interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
}

function NavLink({ href, label, isActive = false }: NavLinkProps) {
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
}

export function ProductSectionNav({ activeSection = 'overview' }: { activeSection?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 overflow-x-auto">
      <div className="flex space-x-2">
        <NavLink href="#overview" label="Aperçu" isActive={activeSection === 'overview'} />
        <NavLink href="#analytics" label="Analyses" isActive={activeSection === 'analytics'} />
        <NavLink href="#comparison" label="Comparaison" isActive={activeSection === 'comparison'} />
        <NavLink href="#pharmacies" label="Pharmacies" isActive={activeSection === 'pharmacies'} />
        <NavLink href="#results" label="Résultats" isActive={activeSection === 'results'} />
      </div>
    </div>
  );
}