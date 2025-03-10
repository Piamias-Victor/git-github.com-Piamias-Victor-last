'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { DateRangeSelector } from '@/components/shared/DateRangeSelector';

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  showDateSelector: boolean;
}

/**
 * Composant pour le menu mobile
 */
export function MobileMenu({ isOpen, isAuthenticated, showDateSelector }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
      <nav className="flex flex-col space-y-3 px-2">
        {isAuthenticated ? (
          // Menu mobile pour utilisateurs connectés
          <>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Tableau de bord
            </Link>
            <Link href="/dashboard/analytics" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Analyses
            </Link>
            
            {/* Date selector in mobile menu */}
            {showDateSelector && (
              <div className="py-2">
                <DateRangeSelector />
              </div>
            )}
            
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-left text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Déconnexion
            </button>
          </>
        ) : (
          // Menu mobile pour visiteurs
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
            <Link href="/auth/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
              Se connecter
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}