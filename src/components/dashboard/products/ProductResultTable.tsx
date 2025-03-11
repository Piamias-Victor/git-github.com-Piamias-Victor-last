import { Button, Card, CardHeader } from "@/components/ui/Card";
import { Table, TableHeader, TableHeaderCell, TableBody } from "@/components/ui/Table";
import { useState } from "react";
import { FiList, FiGrid } from "react-icons/fi";
import { ProductTableRow } from "./ProductTableRow";

export interface Product {
  id: string;
  ean: string;
  name: string;
  laboratory: string;
  category: string;
  stock: number;
  price: string;
  margin: string;
  marginRate: string;
  sales: number;
}

interface ProductResultTableProps {
  products: Product[];
}

export function ProductResultTable({ products }: ProductResultTableProps) {
  const [viewMode, setViewMode] = useState<'unit' | 'global'>('unit');
  
  if (products.length === 0) {
    return null;
  }

  // Composant de basculement de mode vue
  const ViewModeToggle = () => (
    <div>
      <Button
        onClick={() => setViewMode('unit')}
        variant={viewMode === 'unit' ? "primary" : "outline"}
        className="mr-2"
        icon={<FiList />}
      >
        Unitaire
      </Button>
      <Button
        onClick={() => setViewMode('global')}
        variant={viewMode === 'global' ? "primary" : "outline"}
        icon={<FiGrid />}
      >
        Globale
      </Button>
    </div>
  );

  return (
    <Card className="mt-6">
      <CardHeader 
        title={`Résultats (${products.length})`}
        action={<ViewModeToggle />}
      />
      
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>Code EAN</TableHeaderCell>
            <TableHeaderCell>Produit</TableHeaderCell>
            <TableHeaderCell>Laboratoire</TableHeaderCell>
            <TableHeaderCell align="right">Stock</TableHeaderCell>
            <TableHeaderCell align="right">
              {viewMode === 'unit' ? 'Prix TTC' : 'CA TTC'}
            </TableHeaderCell>
            <TableHeaderCell align="right">
              {viewMode === 'unit' ? 'Marge' : 'Marge Totale'}
            </TableHeaderCell>
            <TableHeaderCell align="right">Taux</TableHeaderCell>
            <TableHeaderCell align="right">Ventes</TableHeaderCell>
            <TableHeaderCell align="right">Détails</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductTableRow 
              key={product.id} 
              product={product} 
              viewMode={viewMode} 
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}