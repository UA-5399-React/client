import { gql } from '@apollo/client';

export const USER_ADMIN_FIELDS = gql`
  fragment UserAdminFields on UserType {
    id
    email
    role
    firstName
    lastName
    phone
    isActive
    isEmailConfirmed
    lastLoginAt
    avatarUrl
    createdAt
    updatedAt
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      tempPassword
      user {
        ...UserAdminFields
      }
    }
  }
  ${USER_ADMIN_FIELDS}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...UserAdminFields
    }
  }
  ${USER_ADMIN_FIELDS}
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserAdminFields
    }
  }
  ${USER_ADMIN_FIELDS}
`;

export const GET_USERS_LIST = gql`
  query GetUsersList($limit: Int, $page: Int, $search: String) {
    users(limit: $limit, page: $page, search: $search) {
      items {
        ...UserAdminFields
      }
      total
    }
  }
  ${USER_ADMIN_FIELDS}
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
