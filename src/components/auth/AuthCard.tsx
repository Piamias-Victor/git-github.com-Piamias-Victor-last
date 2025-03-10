import Link from 'next/link';
import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/**
 * Composant réutilisable pour les cartes d'authentification
 * (utilisé pour la connexion et l'inscription)
 */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600 to-teal-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              Apo Data
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}