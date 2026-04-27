import { gql } from '@apollo/client';

export const GET_SALES_BY_PRODUCT = gql`
  query GetSalesByProduct(
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $groupBy: GroupByEnum!
    $categoryId: ID
  ) {
    getSalesByProduct(
      dateFrom: $dateFrom
      dateTo: $dateTo
      groupBy: $groupBy
      categoryId: $categoryId
    ) {
      items {
        productName
        unitsSold
        revenue
        productCode
      }
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
  ) {
    getSalesByDay(
      dateFrom: $dateFrom
      dateTo: $dateTo
      groupBy: $groupBy
      categoryId: $categoryId
    ) {
      items {
        date
        ordersCount
        unitsSold
        revenue
        averageCheck
      }
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
  ) {
    getSalesByCategory(
      dateFrom: $dateFrom
      dateTo: $dateTo
      groupBy: $groupBy
      categoryId: $categoryId
    ) {
      items {
        category
        unitsSold
        revenue
      }
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
    $aThreshold: Int
    $bThreshold: Int
    $categoryId: ID
  ) {
    getAbcAnalysis(
      dateFrom: $dateFrom
      dateTo: $dateTo
      metric: $metric
      aThreshold: $aThreshold
      bThreshold: $bThreshold
      categoryId: $categoryId
    ) {
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
