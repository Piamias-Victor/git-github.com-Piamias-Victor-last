// src/components/dashboard/products/ProductTableRow.tsx
import { Badge } from '@/components/ui/Card';
import { TableRow, TableCell } from '@/components/ui/Table';
import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { ProductExpandedView } from './ProductExpandedView';
import { Product } from './ProductResultTable';

interface ProductTableRowProps {
  product: Product;
  viewMode: 'unit' | 'global';
}

export function ProductTableRow({ product, viewMode }: ProductTableRowProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Calculs pour la vue globale
  const globalPrice = parseFloat(product.price) * product.sales;
  const globalMargin = parseFloat(product.margin) * product.sales;
  
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Badge de stock avec couleur selon niveau
  const StockBadge = ({ stock }: { stock: number }) => {
    let variant: "success" | "warning" | "error" = "success";
    
    if (stock <= 5) variant = "error";
    else if (stock <= 20) variant = "warning";
    
    return <Badge variant={variant}>{stock}</Badge>;
  };

  return (
    <>
      <TableRow isHighlighted={expanded}>
        <TableCell>
          <span className="font-mono text-gray-500 dark:text-gray-400">{product.ean}</span>
        </TableCell>
        <TableCell>
          <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
        </TableCell>
        <TableCell>
          <span className="text-gray-500 dark:text-gray-300">{product.laboratory}</span>
        </TableCell>
        <TableCell align="right">
          <StockBadge stock={product.stock} />
        </TableCell>
        <TableCell align="right">
          <span className="font-medium text-gray-900 dark:text-white">
            {viewMode === 'unit' 
              ? `${product.price} €` 
              : `${formatCurrency(globalPrice)} €`
            }
          </span>
        </TableCell>
        <TableCell align="right">
          <span className="font-medium text-gray-900 dark:text-white">
            {viewMode === 'unit' 
              ? `${product.margin} €` 
              : `${formatCurrency(globalMargin)} €`
            }
          </span>
        </TableCell>
        <TableCell align="right">
          <span className={Number(product.marginRate.replace('%', '')) > 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'}>
            {product.marginRate}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className="font-medium text-gray-900 dark:text-white">{product.sales}</span>
        </TableCell>
        <TableCell align="right">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center p-1.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50 transition-colors"
            title={expanded ? "Masquer les détails" : "Afficher les détails"}
          >
            {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </button>
        </TableCell>
      </TableRow>
      
      {expanded && (
        <tr className="bg-indigo-50 dark:bg-indigo-900/20">
          <td colSpan={9} className="px-6 py-4">
            <ProductExpandedView product={product} />
          </td>
        </tr>
      )}
    </>
  );
}