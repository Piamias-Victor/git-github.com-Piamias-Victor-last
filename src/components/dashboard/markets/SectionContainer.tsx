// src/components/ui/SectionContainer.tsx
import React, { ReactNode } from 'react';

interface SectionContainerProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  title,
  subtitle,
  icon,
  children
}) => {
  return (
    <section id={id} className="mt-8">
      <div className="mb-4">
        <div className="flex items-center">
          {icon && (
            <div className="mr-3 p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
};