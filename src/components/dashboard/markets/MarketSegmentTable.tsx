// src/components/dashboard/markets/MarketSegmentTable.tsx
import React, { useState, useMemo } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch, FiTrendingUp, FiTrendingDown, FiInfo } from 'react-icons/fi';
import { MarketSegment } from '@/app/dashboard/detailed-analysis/market-analysis/page';

interface MarketSegmentTableProps {
  segments: MarketSegment[];
  onSegmentSelect: (segment: MarketSegment) => void;
}

export function MarketSegmentTable({ segments, onSegmentSelect }: MarketSegmentTableProps) {
  // État pour la recherche, le tri et la pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fonction pour basculer le tri
  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc'); // Par défaut, tri descendant
    }
  };

  // Filtrer et trier les segments
  const filteredAndSortedSegments = useMemo(() => {
    // D'abord filtrer par terme de recherche
    let result = segments;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = segments.filter(segment => 
        segment.name.toLowerCase().includes(lowerSearch) ||
        (segment.dominantLab && segment.dominantLab.toLowerCase().includes(lowerSearch))
      );
    }

    // Ensuite trier
    return [...result].sort((a, b) => {
      let valueA, valueB;
      
      // Extraire les valeurs à comparer selon la colonne de tri
      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'products':
          valueA = a.products;
          valueB = b.products;
          break;
        case 'revenue':
          valueA = a.revenue;
          valueB = b.revenue;
          break;
        case 'growth':
          valueA = parseFloat(a.growth.replace('%', '').replace('+', ''));
          valueB = parseFloat(b.growth.replace('%', '').replace('+', ''));
          break;
        case 'marketShare':
          valueA = parseFloat(a.marketShare.replace('%', ''));
          valueB = parseFloat(b.marketShare.replace('%', ''));
          break;
        case 'dominantLab':
          valueA = a.dominantLab ? a.dominantLab.toLowerCase() : 'zzz';
          valueB = b.dominantLab ? b.dominantLab.toLowerCase() : 'zzz';
          break;
        default:
          valueA = a.revenue;
          valueB = b.revenue;
      }
      
      // Comparer avec direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [segments, searchTerm, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSegments.length / itemsPerPage);
  const currentSegments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedSegments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedSegments, currentPage]);

  // Formater les valeurs monétaires
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Changer de page
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Composant pour afficher l'en-tête de colonne triable
  function SortableHeader({ 
    title, 
    column 
  }: { 
    title: string; 
    column: string;
  }) {
    return (
      <th
        scope="col"
        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none"
        onClick={() => toggleSort(column)}
      >
        <div className="flex items-center group">
          <span>{title}</span>
          <span className="ml-2 flex-none">
            {sortBy === column ? (
              sortDirection === 'desc' ? (
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <FiChevronUp className="h-4 w-4 text-gray-400" />
              )
            ) : (
              <FiChevronDown className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
            )}
          </span>
        </div>
      </th>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-base font-medium leading-6 text-gray-900 dark:text-white">
            Liste des segments
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filteredAndSortedSegments.length} segments trouvés
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-none">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Rechercher..."
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-opacity-20 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <SortableHeader title="Nom" column="name" />
                    <SortableHeader title="Produits" column="products" />
                    <SortableHeader title="Chiffre d'affaires" column="revenue" />
                    <SortableHeader title="Croissance" column="growth" />
                    <SortableHeader title="Part de marché" column="marketShare" />
                    <SortableHeader title="Laboratoire dominant" column="dominantLab" />
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Voir détails</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {currentSegments.map((segment) => (
                    <tr key={segment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        {segment.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {segment.products}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(segment.revenue)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center">
                          {segment.growth.startsWith('-') ? (
                            <FiTrendingDown className="mr-1 h-4 w-4 flex-shrink-0 text-red-500 dark:text-red-400" />
                          ) : (
                            <FiTrendingUp className="mr-1 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400" />
                          )}
                          <span className={segment.growth.startsWith('-') 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'text-green-500 dark:text-green-400'
                          }>
                            {segment.growth}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {segment.marketShare}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {segment.dominantLab || 'N/A'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => onSegmentSelect(segment)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          Détails<span className="sr-only">, {segment.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 mt-4 rounded-b-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Précédent
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Affichage de{' '}
                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedSegments.length)}
                </span>{' '}
                sur <span className="font-medium">{filteredAndSortedSegments.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">Précédent</span>
                  <FiChevronUp className="h-5 w-5 rotate-90" />
                </button>
                
                {/* Pages */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    // Si moins de 5 pages, afficher toutes les pages
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // Si sur les premières pages, afficher les 5 premières
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Si sur les dernières pages, afficher les 5 dernières
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Sinon, afficher 2 pages avant et 2 pages après
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-indigo-600 text-white focus:z-20'
                          : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">Suivant</span>
                  <FiChevronDown className="h-5 w-5 rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* Message si aucun résultat */}
      {filteredAndSortedSegments.length === 0 && (
        <div className="text-center py-10">
          <FiInfo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">Aucun résultat</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Aucun segment ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
}