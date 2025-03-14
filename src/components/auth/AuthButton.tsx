import React from 'react';

interface AuthButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
  type?: 'submit' | 'button' | 'reset';
}

/**
 * Bouton réutilisable pour les actions d'authentification
 */
export function AuthButton({ 
  isLoading, 
  loadingText, 
  children, 
  type = 'submit' 
}: AuthButtonProps) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
    >
      {isLoading ? (
        <span className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        <span className="inline-flex items-center">
          {children}
        </span>
      )}
    </button>
  );
}