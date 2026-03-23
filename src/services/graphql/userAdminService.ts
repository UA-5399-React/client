import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      role
      isActive
    }
  }
`;

export const GET_USERS_LIST = gql`
  query GetUsersList($input: GetUsersInput) {
    getUsers(input: $input) {
      id
      firstName
      lastName
      email
      role
      isActive
      createdAt
    }
  }
`;
