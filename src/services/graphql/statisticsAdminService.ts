import { gql } from '@apollo/client';

export const GET_SALES_BY_PRODUCT = gql`
  query GetSalesByProduct(
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $groupBy: GroupByEnum!
    $categoryId: ID
    $page: Int
    $limit: Int
  ) {
    getSalesByProduct(
      dateFrom: $dateFrom
      dateTo: $dateTo
      groupBy: $groupBy
      categoryId: $categoryId
      page: $page
      limit: $limit
    ) {
      items {
        productName
        unitsSold
        revenue
        productCode
      }
      total
      page
      limit
      summary {
        totalUnitsSold
        totalRevenue
      }
    }
  }
`;

export const GET_SALES_BY_DAY = gql`
  query GetSalesByDay(
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $groupBy: GroupByEnum!
    $categoryId: ID
    $page: Int
    $limit: Int
  ) {
    getSalesByDay(
      dateFrom: $dateFrom
      dateTo: $dateTo
      groupBy: $groupBy
      categoryId: $categoryId
      page: $page
      limit: $limit
    ) {
      items {
        date
        ordersCount
        unitsSold
        revenue
        averageCheck
      }
      total
      page
      limit
      summary {
        totalOrdersCount
        totalUnitsSold
        totalRevenue
        averageCheck
      }
    }
  }
`;

export const GET_SALES_BY_CATEGORY = gql`
  query GetSalesByCategory(
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $groupBy: GroupByEnum!
    $categoryId: ID
    $page: Int
    $limit: Int
  ) {
    getSalesByCategory(
      dateFrom: $dateFrom
      dateTo: $dateTo
      groupBy: $groupBy
      categoryId: $categoryId
      page: $page
      limit: $limit
    ) {
      items {
        category
        unitsSold
        revenue
      }
      total
      page
      limit
      summary {
        totalUnitsSold
        totalRevenue
      }
    }
  }
`;

export const GET_ABC_ANALYSIS = gql`
  query GetAbcAnalysis(
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $metric: AbcMetricEnum!
    $page: Int!
    $limit: Int!
    $aThreshold: Int
    $bThreshold: Int
    $categoryId: ID
    $search: String
  ) {
    getAbcAnalysis(
      dateFrom: $dateFrom
      dateTo: $dateTo
      metric: $metric
      page: $page
      limit: $limit
      aThreshold: $aThreshold
      bThreshold: $bThreshold
      categoryId: $categoryId
      search: $search
    ) {
      total
      page
      limit
      items {
        productName
        productCode
        value
        cumulativeValue
        totalValue
        cumulativePercentage
        percentageByTotal
        bucket
      }
      summary {
        aCount
        bCount
        cCount
        metric
        totalValue
      }
    }
  }
`;

export const SALES_DYNAMICS_QUERY = gql`
  query SalesDynamics(
    $productIds: [ID!]!
    $from: DateTime!
    $to: DateTime!
    $groupBy: GroupBy!
  ) {
    salesDynamics(
      productIds: $productIds
      from: $from
      to: $to
      groupBy: $groupBy
    ) {
      date
      productId
      value
    }
  }
`;
