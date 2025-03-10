import React from 'react';

interface AuthFormErrorProps {
  error: string | null;
}

/**
 * Composant pour afficher les erreurs dans les formulaires d'authentification
 */
export function AuthFormError({ error }: AuthFormErrorProps) {
  if (!error) return null;
  
  return (
    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded">
      {error}
    </div>
  );
}