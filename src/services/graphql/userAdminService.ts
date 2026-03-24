import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      role
      isActive
    }
  }
`;

export const GET_USERS_LIST = gql`
  query GetUsersList($limit: Int, $page: Int, $search: String) {
    users(limit: $limit, page: $page, search: $search) {
      items {
        id
        firstName
        lastName
        email
        role
        isActive
        createdAt
        updatedAt
        lastLoginAt
      }
      total
    }
  }
`;
