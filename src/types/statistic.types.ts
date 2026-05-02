export interface UserStatsRegistrationDay {
  day: number;
  date: string;
  count: number;
}

export interface UserStatsQueryData {
  userStats: {
    registrationsMonth: number;
    registrationsByDay: UserStatsRegistrationDay[];
  };
}

export interface RegistrationByDayRow {
  day: number;
  count: number;
}

export type GroupByEnum = 'PRODUCT' | 'DAY' | 'CATEGORY';

export interface SalesByProductItem {
  productName: string;
  unitsSold: number;
  revenue: number;
  productCode: string | null;
}

export interface SalesByProductSummary {
  totalUnitsSold: number;
  totalRevenue: number;
}

export interface SalesByDayItem {
  date: string;
  ordersCount: number;
  unitsSold: number;
  revenue: number;
  averageCheck: number;
}

export interface SalesByDaySummary {
  totalOrdersCount: number;
  totalUnitsSold: number;
  totalRevenue: number;
  averageCheck: number;
}

export interface SalesByCategoryItem {
  category: string;
  unitsSold: number;
  revenue: number;
}

export interface SalesByCategorySummary {
  totalUnitsSold: number;
  totalRevenue: number;
}

export interface PaginatedSalesResponse<TItem, TSummary> {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
  summary: TSummary;
}

export interface SalesByProductQueryData {
  getSalesByProduct: PaginatedSalesResponse<
    SalesByProductItem,
    SalesByProductSummary
  >;
}

export interface SalesByDayQueryData {
  getSalesByDay: PaginatedSalesResponse<SalesByDayItem, SalesByDaySummary>;
}

export interface SalesByCategoryQueryData {
  getSalesByCategory: PaginatedSalesResponse<
    SalesByCategoryItem,
    SalesByCategorySummary
  >;
}

export interface SalesByProductQueryVariables {
  dateFrom: string;
  dateTo: string;
  groupBy: GroupByEnum;
  categoryId?: string | null;
  page?: number;
  limit?: number;
}

export type AbcMetricEnum = 'UNITS' | 'REVENUE';
export type AbcBucket = 'A' | 'B' | 'C';

export interface AbcAnalysisItem {
  productName: string;
  productCode: string | null;
  value: number;
  cumulativeValue: number;
  totalValue: number;
  cumulativePercentage: number;
  percentageByTotal: number;
  bucket: AbcBucket;
}

export interface AbcAnalysisSummary {
  aCount: number;
  bCount: number;
  cCount: number;
  metric: AbcMetricEnum;
  totalValue: number;
}

export interface AbcAnalysisQueryData {
  getAbcAnalysis: {
    items: AbcAnalysisItem[];
    summary: AbcAnalysisSummary;
  };
}

export interface AbcAnalysisQueryVariables {
  dateFrom: string;
  dateTo: string;
  metric: AbcMetricEnum;
  aThreshold?: number;
  bThreshold?: number;
  categoryId?: string | null;
}
