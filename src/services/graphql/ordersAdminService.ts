import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query Orders(
    $page: Int!
    $limit: Int!
    $sort: OrdersSortField!
    $order: SortOrder!
  ) {
    orders(page: $page, limit: $limit, sort: $sort, order: $order) {
      total
      totalPages
      page
      limit
      items {
        id
        orderId
        status
        amount
        totalPrice
        createdAt
        updatedAt
        items {
          title
          imageUrl
          unitPrice
          amount
        }
        user {
          email
          firstName
          lastName
          phone
        }
      }
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($orderId: String!) {
    deleteOrder(orderId: $orderId)
  }
`;
