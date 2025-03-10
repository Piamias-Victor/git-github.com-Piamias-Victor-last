'use client';

import React from 'react';
import Link from 'next/link';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

interface AuthButtonsProps {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  userName?: string;
}

/**
 * Composant pour les boutons d'authentification
 */
export function AuthButtons({ status, userName }: AuthButtonsProps) {
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
          {userName}
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
}