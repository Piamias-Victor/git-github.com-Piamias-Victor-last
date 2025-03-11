// src/components/ui/LoadingState.tsx
import React from 'react';

interface LoadingStateProps {
  height?: string;
  message?: string;
}

/**
 * Composant d'état de chargement réutilisable
 */
export function LoadingState({ height = "40", message = "" }: LoadingStateProps) {
  return (
    <div className={`h-${height} bg-gray-50 dark:bg-gray-700/50 rounded-lg flex flex-col items-center justify-center`}>
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
      {message && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>}
    </div>
  );
}

// src/components/ui/ErrorState.tsx
interface ErrorStateProps {
  message: string;
  height?: string;
}

/**
 * Composant d'état d'erreur réutilisable
 */
export function ErrorState({ message, height = "40" }: ErrorStateProps) {
  return (
    <div className={`h-${height} bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 p-4`}>
      {message}
    </div>
  );
}