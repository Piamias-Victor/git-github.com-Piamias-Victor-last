'use client';

import Link from "next/link";
import { FiMenu, FiUser, FiLogOut } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Header Component
 * 
 * Main navigation component for the website.
 * Features a clean, minimal design with smooth transitions.
 */
export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ne pas afficher le header sur les pages d'authentification
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  // Afficher bouton de connexion ou profil selon l'état de la session
  const AuthButton = () => {
    if (status === 'loading') {
      return <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>;
    }

    if (status === 'authenticated') {
      return (
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard" 
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <FiUser size={16} />
            {session.user?.name}
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            <FiLogOut className="mr-2" size={16} />
            Déconnexion
          </button>
        </div>
      );
    }

    return (
      <Link 
        href="/auth/login" 
        className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
      >
        Se connecter
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* Logo placeholder - replace with actual logo */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-teal-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Apo Data
              </span>
            </Link>
          </div>
          
          {/* Navigation links - desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {status === 'authenticated' ? (
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
          
          {/* Auth button */}
          <div className="flex items-center gap-3">
            <AuthButton />
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile menu (simplifié) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3 px-2">
              {status === 'authenticated' ? (
                // Menu mobile pour utilisateurs connectés
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Tableau de bord
                  </Link>
                  <Link href="/dashboard/analytics" className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Analyses
                  </Link>
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
        )}
      </div>
    </header>
  );
}