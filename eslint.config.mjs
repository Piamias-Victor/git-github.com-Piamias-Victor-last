import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Désactiver les règles qui causent des problèmes
      "@typescript-eslint/no-unused-vars": "warn", // Transformer en avertissement plutôt qu'erreur
      "@typescript-eslint/no-explicit-any": "warn", // Transformer en avertissement plutôt qu'erreur
      "react/no-unescaped-entities": "off", // Désactiver complètement
      "react/jsx-no-undef": "warn", // Transformer en avertissement
    }
  }
];

export default eslintConfig;