import Link from "next/link";

/**
 * Footer Component
 * 
 * Simple footer with copyright information and basic links.
 */
export function Footer() {
    return (
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-600 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Apo Data
                </span>
              </Link>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-center md:text-right text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Phardev. Tous droits réservés.
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400">
              Mentions légales
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400">
              Politique de confidentialité
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400">
              CGU
            </a>
          </div>
        </div>
      </footer>
    );
  }