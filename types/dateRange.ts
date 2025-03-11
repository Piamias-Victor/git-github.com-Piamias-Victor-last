// src/types/dateRange.ts

import { ReactNode } from "react";

export interface DateRangeContextType {
    range: string;
    startDate: string;
    endDate: string;
    displayLabel: string;
    setDateRange: (range: string, start?: string, end?: string) => void;
  }
  
  export interface DateRangeProviderProps {
    children: ReactNode;
  }