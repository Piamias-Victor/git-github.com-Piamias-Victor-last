'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { FiArrowLeft, FiFilter, FiDownload } from 'react-icons/fi';

// Données simulées pour les produits à marge négative
const negativeMarginProducts = [
  { id: 1, name: 'Paracétamol Générique 500mg', price: '1.95 €', cost: '2.10 €', margin: '-0.15 €', marginRate: '-7.1%', lastModified: '08/03/2025' },
  { id: 2, name: 'Ibuprofène 400mg Boîte', price: '3.50 €', cost: '3.82 €', margin: '-0.32 €', marginRate: '-8.4%', lastModified: '05/03/2025' },
  { id: 3, name: 'Amoxicilline 500mg Sachet', price: '4.25 €', cost: '4.48 €', margin: '-0.23 €', marginRate: '-5.1%', lastModified: '02/03/2025' },
  { id: 4, name: 'Oméprazole 20mg', price: '5.30 €', cost: '5.62 €', margin: '-0.32 €', marginRate: '-5.7%', lastModified: '28/02/2025' },
  { id: 5, name: 'Vitamine D3 1000UI', price: '6.15 €', cost: '6.50 €', margin: '-0.35 €', marginRate: '-5.4%', lastModified: '25/02/2025' },
];

/**
 * Page des produits à marge négative
 * 
 * Affiche la liste des produits dont la marge est négative
 * et propose des actions pour résoudre ce problème.
 */
export default function NegativeMarginsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Afficher un état de chargement si la session est en cours de chargement
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Si pas de session, ne rien afficher (la redirection se fera via useEffect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiArrowLeft className="mr-2" /> Retour au tableau de bord
          </Link>
        </div>
        
        <DashboardHeader 
          title="Produits à marge négative"
          subtitle="Liste des produits dont le prix de vente est inférieur au prix de revient"
        />
        
        {/* Actions et filtres */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiFilter className="mr-2" /> Filtrer
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiDownload className="mr-2" /> Exporter
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-red-600 dark:text-red-400">{negativeMarginProducts.length}</span> produits avec une marge négative
          </p>
        </div>
        
        {/* Tableau des produits */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prix de vente
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prix de revient
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Marge
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Taux
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dernière modif.
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {negativeMarginProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">
                      {product.cost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400 font-medium">
                      {product.margin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400 font-medium">
                      {product.marginRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">
                      {product.lastModified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                        Ajuster
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recommandations */}
        <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recommandations
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-2 flex-shrink-0">1</span>
              <span>Vérifiez les prix d'achat auprès de vos fournisseurs. Certains produits pourraient bénéficier de remises sur volume.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-2 flex-shrink-0">2</span>
              <span>Ajustez les prix de vente pour maintenir une marge minimale de 5% sur tous les produits.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-2 flex-shrink-0">3</span>
              <span>Évaluez la possibilité de remplacer certains produits par des alternatives plus rentables.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}