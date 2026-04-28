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

export interface SalesByProductQueryData {
  getSalesByProduct: {
    items: SalesByProductItem[];
    summary: SalesByProductSummary;
  };
}

export interface SalesByDayQueryData {
  getSalesByDay: {
    items: SalesByDayItem[];
    summary: SalesByDaySummary;
  };
}

export interface SalesByCategoryQueryData {
  getSalesByCategory: {
    items: SalesByCategoryItem[];
    summary: SalesByCategorySummary;
  };
}

export interface SalesByProductQueryVariables {
  dateFrom: string;
  dateTo: string;
  groupBy: GroupByEnum;
  categoryId?: string | null;
}
