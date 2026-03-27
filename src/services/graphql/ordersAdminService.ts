import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query Orders(
    $page: Int!
    $limit: Int!
    $sort: OrdersSortField!
    $order: SortOrder!
    $filter: OrdersFilterInput
  ) {
    orders(
      page: $page
      limit: $limit
      sort: $sort
      order: $order
      filter: $filter
    ) {
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

export const GET_ORDERS_COUNTS = gql`
  query GetOrdersCounts {
    all: orders(limit: 1) {
      total
    }
    new: orders(limit: 1, filter: { status: NEW }) {
      total
    }
    processing: orders(limit: 1, filter: { status: PROCESSING }) {
      total
    }
    shipping: orders(limit: 1, filter: { status: SHIPPING }) {
      total
    }
    completed: orders(limit: 1, filter: { status: COMPLETED }) {
      total
    }
    cancelled: orders(limit: 1, filter: { status: CANCELLED }) {
      total
    }
  }
`;
