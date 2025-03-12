import { Button, Card, CardHeader } from "@/components/ui/Card";
import { Table, TableHeader, TableHeaderCell, TableBody } from "@/components/ui/Table";
import { useState } from "react";
import { FiList, FiGrid } from "react-icons/fi";
import { PharmacyTableRow } from "./PharmacyTableRow";

export interface Pharmacy {
  id: string;
  name: string;
  area: string;
  products: number;
  stock: number;
  revenue: number;
  margin: number;
  marginRate: string;
  sales: number;
}

interface PharmacyResultTableProps {
  pharmacies: Pharmacy[];
}

export function PharmacyResultTable({ pharmacies }: PharmacyResultTableProps) {
  const [viewMode, setViewMode] = useState<'unit' | 'global'>('unit');
  
  if (pharmacies.length === 0) {
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
        title={`Pharmacies (${pharmacies.length})`}
        action={<ViewModeToggle />}
      />
      
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Pharmacie</TableHeaderCell>
            <TableHeaderCell>Zone</TableHeaderCell>
            <TableHeaderCell align="right">Produits</TableHeaderCell>
            <TableHeaderCell align="right">Stock</TableHeaderCell>
            <TableHeaderCell align="right">
              {viewMode === 'unit' ? 'CA Moyen' : 'CA Total'}
            </TableHeaderCell>
            <TableHeaderCell align="right">
              {viewMode === 'unit' ? 'Marge Moyenne' : 'Marge Totale'}
            </TableHeaderCell>
            <TableHeaderCell align="right">Taux Moyen</TableHeaderCell>
            <TableHeaderCell align="right">Ventes</TableHeaderCell>
            <TableHeaderCell align="right">Détails</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {pharmacies.map((pharmacy) => (
            <PharmacyTableRow 
              key={pharmacy.id} 
              pharmacy={pharmacy} 
              viewMode={viewMode} 
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}