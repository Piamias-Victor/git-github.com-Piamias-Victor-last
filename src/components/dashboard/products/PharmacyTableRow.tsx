import { Badge } from '@/components/ui/Card';
import { TableRow, TableCell } from '@/components/ui/Table';
import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { PharmacyExpandedView } from './PharmacyExpandedView';
import { Pharmacy } from './PharmacyResultTable';

interface PharmacyTableRowProps {
  pharmacy: Pharmacy;
  viewMode: 'unit' | 'global';
}

export function PharmacyTableRow({ pharmacy, viewMode }: PharmacyTableRowProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Calculs pour la vue globale
  const globalRevenue = viewMode === 'global' ? pharmacy.revenue : pharmacy.revenue / pharmacy.products;
  const globalMargin = viewMode === 'global' ? pharmacy.margin : pharmacy.margin / pharmacy.products;
  
  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Badge de produits avec couleur selon niveau
  const ProductsBadge = ({ count }: { count: number }) => {
    let variant: "success" | "warning" | "error" = "success";
    
    if (count < 50) variant = "error";
    else if (count < 100) variant = "warning";
    
    return <Badge variant={variant}>{count}</Badge>;
  };

  return (
    <>
      <TableRow isHighlighted={expanded}>
        <TableCell>
          <span className="font-mono text-gray-500 dark:text-gray-400">{pharmacy.id}</span>
        </TableCell>
        <TableCell>
          <div className="max-w-[15rem] truncate">
            <span className="font-medium text-gray-900 dark:text-white" title={pharmacy.name}>
              {pharmacy.name}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-gray-500 dark:text-gray-300">{pharmacy.area}</span>
        </TableCell>
        <TableCell align="right">
          <ProductsBadge count={pharmacy.products} />
        </TableCell>
        <TableCell align="right">
          <span className="text-gray-900 dark:text-white">{pharmacy.stock}</span>
        </TableCell>
        <TableCell align="right">
          <span className="font-medium text-gray-900 dark:text-white">
            {`${formatCurrency(globalRevenue)} €`}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className="font-medium text-gray-900 dark:text-white">
            {`${formatCurrency(globalMargin)} €`}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className={Number(pharmacy.marginRate.replace('%', '')) > 25
            ? 'text-green-600 dark:text-green-400'
            : Number(pharmacy.marginRate.replace('%', '')) > 20
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-red-600 dark:text-red-400'}>
            {pharmacy.marginRate}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className="font-medium text-gray-900 dark:text-white">{pharmacy.sales}</span>
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
          <td colSpan={10} className="px-6 py-4">
            <PharmacyExpandedView pharmacy={pharmacy} />
          </td>
        </tr>
      )}
    </>
  );
}