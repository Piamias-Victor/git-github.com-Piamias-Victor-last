import React from 'react';

interface CodeListInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * Composant pour la saisie de liste de codes
 */
export function CodeListInput({ value, onChange }: CodeListInputProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={onChange}
        rows={5}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Collez une liste de codes EAN (séparés par des sauts de ligne, virgules ou points-virgules)"
      />
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Les codes seront automatiquement formatés au format 13 caractères.
      </p>
    </div>
  );
}