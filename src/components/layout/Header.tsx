// src/components/layout/Header.tsx
'use client';

import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { EnhancedDateRangeSelector } from "@/components/shared/EnhancedDateRangeSelector";
import { AdvancedPharmacySelector } from "@/components/shared/AdvancedPharmacySelector";
import { NavLinks } from "./NavLinks";
import { AuthButtons } from "./AuthButtons";
import { MobileMenu } from "./MobileMenu";
import { usePharmacySelection } from "@/providers/PharmacyProvider";

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
  const { selectedPharmacies, setPharmacies } = usePharmacySelection();

  // Ne pas afficher le header sur les pages d'authentification
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  // Vérifier si on est sur le dashboard ou une page qui nécessite la sélection de dates/pharmacies
  const showSelectors = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-teal-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Apo Data
              </span>
            </Link>
          </div>
          
          {/* Navigation links - desktop */}
          <NavLinks isAuthenticated={isAuthenticated} />
          
          {/* Sélecteurs et auth buttons */}
          <div className="flex items-center gap-3">
            {/* Sélecteurs (uniquement sur les pages de dashboard) */}
            {showSelectors && (
              <div className="hidden md:flex items-center space-x-2">
                <EnhancedDateRangeSelector />
                <AdvancedPharmacySelector 
                  selectedPharmacies={selectedPharmacies}
                  onPharmacyChange={setPharmacies}
                />
              </div>
            )}
            
            <AuthButtons 
              status={status} 
              userName={session?.user?.name || undefined} 
            />
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen}
          isAuthenticated={isAuthenticated}
          showDateSelector={showSelectors}
          showPharmacySelector={showSelectors}
          selectedPharmacies={selectedPharmacies}
          onPharmacyChange={setPharmacies}
        />
      </div>
    </header>
  );
}