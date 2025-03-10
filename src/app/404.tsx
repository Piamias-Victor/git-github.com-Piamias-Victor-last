'use client';

import { Suspense } from 'react';
import Link from 'next/link';

// Composant principal pour la page 404
function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Page non trouvée
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors duration-200 shadow-sm"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

// Composant enveloppé dans Suspense
export default function NotFound() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Chargement...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}