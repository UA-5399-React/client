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
          product
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
export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      id
      orderId
      status
      updatedAt
    }
  }
`;

export const UPDATE_ORDER_USER_INFO = gql`
  mutation UpdateOrderUserInfo($input: UpdateOrderUserInput!) {
    updateOrderUserInfo(input: $input) {
      id
      orderId
      status
      user {
        firstName
        lastName
        email
        phone
      }
      updatedAt
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($orderId: String!) {
    deleteOrder(orderId: $orderId)
  }
`;
