// src/components/ui/SectionContainer.tsx
import React, { ReactNode } from 'react';

interface SectionContainerProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

/**
 * Composant conteneur pour les sections avec ID pour la navigation
 */
export function SectionContainer({ 
  id, 
  children, 
  className = "", 
  title,
  subtitle,
  icon
}: SectionContainerProps) {
  return (
    <section 
      id={id} 
      className={`mt-6 pt-4 scroll-mt-24 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              {icon && <span className="mr-2">{icon}</span>}
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </section>
  );
}