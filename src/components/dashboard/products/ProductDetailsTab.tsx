import React from 'react';
import { Product } from './ProductResultTable';

interface ProductDetailsTabProps {
  product: Product;
}

/**
 * Onglet des détails du produit
 */
export function ProductDetailsTab({ product }: ProductDetailsTabProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Code EAN</h4>
        <p className="text-sm font-mono text-gray-800 dark:text-gray-200">{product.ean}</p>
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nom</h4>
        <p className="text-sm text-gray-800 dark:text-gray-200">{product.name}</p>
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Laboratoire</h4>
        <p className="text-sm text-gray-800 dark:text-gray-200">{product.laboratory}</p>
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Catégorie</h4>
        <p className="text-sm text-gray-800 dark:text-gray-200">{product.category}</p>
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Prix TTC</h4>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{product.price} €</p>
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Marge</h4>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{product.margin} €</p>
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Taux de marge</h4>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{product.marginRate}</p>
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Stock actuel</h4>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{product.stock} unités</p>
      </div>
    </div>
  );
}