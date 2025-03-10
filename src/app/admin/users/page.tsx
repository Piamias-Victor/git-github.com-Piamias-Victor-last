'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiMail, FiLock, FiBox } from 'react-icons/fi';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthFormError } from '@/components/auth/AuthFormError';

// Simuler des utilisateurs pour cet exemple
const mockUsers = [
  { id: '1', name: 'Admin Test', email: 'admin@apodata.fr', role: 'admin', pharmacyName: 'Pharmacie Test', createdAt: '2025-03-01' },
  { id: '2', name: 'Jean Dupont', email: 'jean@example.com', role: 'user', pharmacyName: 'Pharmacie Centrale', createdAt: '2025-03-02' },
  { id: '3', name: 'Marie Martin', email: 'marie@example.com', role: 'user', pharmacyName: 'Pharmacie du Marché', createdAt: '2025-03-03' },
];

function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pharmacyName: '',
    role: 'user',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Simulation d'un appel API pour la création d'utilisateur
    // Dans une app réelle, ce serait un fetch vers votre API
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(`L'utilisateur ${formData.name} a été créé avec succès.`);
      setFormData({
        name: '',
        email: '',
        password: '',
        pharmacyName: '',
        role: 'user',
      });
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Créer un nouveau compte utilisateur
      </h3>

      {success && (
        <div className="p-4 mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormError error={error} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthInput
            id="name"
            name="name"
            type="text"
            icon={<FiUser className="h-5 w-5 text-gray-400" />}
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            label="Nom complet"
          />

          <AuthInput
            id="email"
            name="email"
            type="email"
            icon={<FiMail className="h-5 w-5 text-gray-400" />}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
          />

          <AuthInput
            id="password"
            name="password"
            type="password"
            icon={<FiLock className="h-5 w-5 text-gray-400" />}
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            label="Mot de passe"
          />

          <AuthInput
            id="pharmacyName"
            name="pharmacyName"
            type="text"
            icon={<FiBox className="h-5 w-5 text-gray-400" />}
            placeholder="Nom de la pharmacie"
            value={formData.pharmacyName}
            onChange={handleChange}
            label="Pharmacie"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div className="mt-2">
          <AuthButton isLoading={isLoading} loadingText="Création en cours...">
            <FiPlus className="mr-2" /> Créer le compte
          </AuthButton>
        </div>
      </form>
    </div>
  );
}

function UsersList() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Utilisateurs
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pharmacie
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rôle
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date création
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.pharmacyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                    <FiEdit2 size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Vérifier si l'utilisateur est un administrateur
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Rediriger si l'utilisateur n'est pas un administrateur
  if (!session || session.user?.role !== 'admin') {
    // Dans une vraie application, utilisez middleware ou côté serveur
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Gestion des utilisateurs
        </h1>

        <div className="space-y-8">
          <CreateUserForm />
          <UsersList />
        </div>
      </div>
    </div>
  );
}