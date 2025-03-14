import { MarketSegment } from "@/app/dashboard/detailed-analysis/market-analysis/page";
import { formatCurrency } from "@/utils/marketSegmentData";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { SegmentItem } from "./SegmentItem";


interface HierarchyGroupProps {
  group: {
    name: string;
    children: MarketSegment[];
    totalRevenue: number;
    totalProducts: number;
  };
  groupId: string;
  isExpanded: boolean;
  onToggle: (groupId: string) => void;
  onSegmentSelect: (segment: MarketSegment) => void;
}

export function HierarchyGroup({ 
  group, 
  groupId, 
  isExpanded, 
  onToggle, 
  onSegmentSelect 
}: HierarchyGroupProps) {
  return (
    <div className="mb-3">
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors border border-gray-100 dark:border-gray-700"
        onClick={() => onToggle(groupId)}
      >
        <div className="flex items-center">
          {isExpanded 
            ? <FiChevronDown className="mr-2 text-indigo-500" /> 
            : <FiChevronRight className="mr-2 text-indigo-500" />
          }
          <div>
            <span className="font-medium text-gray-900 dark:text-white">{group.name}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({group.children.length} segments)
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(group.totalRevenue)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {group.totalProducts} produits
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-2 pl-6 space-y-2 animate-fadeIn">
          {group.children.map((segment) => (
            <SegmentItem 
              key={segment.id}
              segment={segment}
              onClick={() => onSegmentSelect(segment)}
            />
          ))}
        </div>
      )}
    </div>
  );
}