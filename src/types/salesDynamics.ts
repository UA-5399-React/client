import { type GroupBy } from '@/constants/salesDynamics';

export type GroupByType = (typeof GroupBy)[keyof typeof GroupBy];

export interface SalesDynamicsPoint {
  date: string;
  productId: string;
  value: number;
}

export interface SalesDynamicsVars {
  productIds: string[];
  from: string;
  to: string;
  groupBy: GroupByType;
}

export interface SalesDynamicsData {
  salesDynamics: SalesDynamicsPoint[];
}
