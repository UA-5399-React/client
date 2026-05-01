import { gql } from '@apollo/client';

export const GET_ORDERS_STATUS_STATS = gql`
  query GetOrdersStatusStats {
    ordersStatusStats {
      total
      statuses {
        status
        count
      }
    }
  }
`;
