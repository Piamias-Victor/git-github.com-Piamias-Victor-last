'use client';

import React from 'react';
import Link from 'next/link';

interface NavLinksProps {
  isAuthenticated: boolean;
}

/**
 * Composant de navigation avec les liens principaux
 */
export function NavLinks({ isAuthenticated }: NavLinksProps) {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {isAuthenticated ? (
        // Menu pour utilisateurs connectés
        <>
          <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
            Tableau de bord
          </Link>
          <Link href="/dashboard/analytics" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
            Analyses
          </Link>
        </>
      ) : (
        // Menu pour visiteurs
        <>
          <a href="#features" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
            Fonctionnalités
          </a>
          <a href="#about" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
            À propos
          </a>
          <a href="#objectives" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
            Objectifs
          </a>
          <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
            Contact
          </a>
        </>
      )}
    </nav>
  );
}