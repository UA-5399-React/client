import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const GroupBy = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
} as const;

export type GroupBy = (typeof GroupBy)[keyof typeof GroupBy];

export interface SalesDynamicsPoint {
  date: string;
  productId: string;
  value: number;
}

export interface SalesDynamicsVars {
  productIds: string[];
  from: string;
  to: string;
  groupBy: GroupBy;
}

export interface SalesDynamicsData {
  salesDynamics: SalesDynamicsPoint[];
}

const SALES_DYNAMICS_QUERY = gql`
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

export const useSalesDynamics = (vars: SalesDynamicsVars | null) => {
  return useQuery<SalesDynamicsData, SalesDynamicsVars>(SALES_DYNAMICS_QUERY, {
    variables: vars ?? {
      productIds: [],
      from: '',
      to: '',
      groupBy: GroupBy.WEEK,
    },
    skip: !vars || vars.productIds.length === 0,
  });
};
