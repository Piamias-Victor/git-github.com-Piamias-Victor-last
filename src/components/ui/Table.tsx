// src/components/ui/Table.tsx
export function Table({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </table>
      </div>
    );
  }
  
  // src/components/ui/TableHeader.tsx
  export function TableHeader({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return (
      <thead className="bg-gray-50 dark:bg-gray-900/50">
        {children}
      </thead>
    );
  }
  
  // src/components/ui/TableBody.tsx
  export function TableBody({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return (
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </tbody>
    );
  }
  
  // src/components/ui/TableRow.tsx
  export function TableRow({ 
    children, 
    isHighlighted = false 
  }: { 
    children: React.ReactNode, 
    isHighlighted?: boolean 
  }) {
    return (
      <tr className={`${isHighlighted ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
        {children}
      </tr>
    );
  }
  
  // src/components/ui/TableCell.tsx
  export function TableCell({ 
    children, 
    align = "left" 
  }: { 
    children: React.ReactNode, 
    align?: "left" | "right" | "center"
  }) {
    return (
      <td className={`px-6 py-4 whitespace-nowrap text-sm text-${align}`}>
        {children}
      </td>
    );
  }
  
  // src/components/ui/TableHeaderCell.tsx
  export function TableHeaderCell({ 
    children, 
    align = "left" 
  }: { 
    children: React.ReactNode, 
    align?: "left" | "right" | "center"
  }) {
    return (
      <th scope="col" className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
        {children}
      </th>
    );
  }