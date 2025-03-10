'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiArrowRight, FiBox } from 'react-icons/fi';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthFormError } from '@/components/auth/AuthFormError';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    pharmacyName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation de base
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          pharmacyName: formData.pharmacyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      router.push('/auth/login?success=1');
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Créer un compte"
      subtitle="Rejoignez la plateforme d'analyse de données pour pharmacies"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <AuthFormError error={error} />

        <div className="space-y-4">
          <AuthInput
            id="name"
            name="name"
            type="text"
            icon={<FiUser className="h-5 w-5 text-gray-400" />}
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            label="Nom complet"
          />

          <AuthInput
            id="pharmacyName"
            name="pharmacyName"
            type="text"
            icon={<FiBox className="h-5 w-5 text-gray-400" />}
            placeholder="Pharmacie du Centre"
            value={formData.pharmacyName}
            onChange={handleChange}
            label="Nom de la pharmacie"
          />

          <AuthInput
            id="email"
            name="email"
            type="email"
            icon={<FiMail className="h-5 w-5 text-gray-400" />}
            placeholder="votre.email@exemple.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            label="Email"
          />

          <AuthInput
            id="password"
            name="password"
            type="password"
            icon={<FiLock className="h-5 w-5 text-gray-400" />}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            label="Mot de passe"
            helpText="Minimum 8 caractères, incluant une majuscule et un chiffre"
          />

          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            icon={<FiLock className="h-5 w-5 text-gray-400" />}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Confirmer le mot de passe"
          />
        </div>

        <AuthButton isLoading={isLoading} loadingText="Inscription en cours...">
          Créer mon compte <FiArrowRight className="ml-2" />
        </AuthButton>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400">
            Se connecter
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}