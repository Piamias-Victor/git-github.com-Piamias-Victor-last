import React from 'react';
import { IconType } from 'react-icons';

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  label: string;
  helpText?: string;
}

/**
 * Composant d'input réutilisable pour les formulaires d'authentification
 */
export function AuthInput({
  id,
  name,
  type,
  icon,
  placeholder,
  value,
  onChange,
  required = true,
  autoComplete,
  label,
  helpText
}: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-sky-500 focus:border-sky-500"
          placeholder={placeholder}
        />
      </div>
      {helpText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}