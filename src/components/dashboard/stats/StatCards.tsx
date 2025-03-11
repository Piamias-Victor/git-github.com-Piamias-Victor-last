// src/components/dashboard/stats/StatCards.tsx
import { Stat } from '@/components/ui/Card';
import { FiBarChart, FiPackage, FiPieChart, FiTrendingUp } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: string;
}

export function StatCards({ data }: { data: StatCardProps[] }) {
  // Fonction pour rendre l'icône appropriée
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'revenue':
        return <FiBarChart size={24} />;
      case 'margin':
        return <FiTrendingUp size={24} />;
      case 'percentage':
        return <FiPieChart size={24} />;
      case 'products':
        return <FiPackage size={24} />;
      default:
        return <FiBarChart size={24} />;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {data.map((stat, index) => (
        <Stat 
          key={index}
          label={stat.title}
          value={stat.value}
          change={stat.change}
          icon={renderIcon(stat.icon)}
        />
      ))}
    </div>
  );
}