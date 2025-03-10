import Link from "next/link";
import { FiMenu } from "react-icons/fi";

/**
 * Header Component
 * 
 * Main navigation component for the website.
 * Features a clean, minimal design with smooth transitions.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* Logo placeholder - replace with actual logo */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Apo Data
              </span>
            </Link>
          </div>
          
          {/* Navigation links - desktop */}
          <nav className="hidden md:flex items-center space-x-6">
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
          </nav>
          
          {/* Login button */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
            >
              Se connecter
            </a>
            
            {/* Mobile menu button - for simplicity not implementing full mobile menu */}
            <button className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300">
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}