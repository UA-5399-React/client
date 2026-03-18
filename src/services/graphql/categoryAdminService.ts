import { gql } from '@apollo/client';

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on CategoryType {
    id: _id
    title
    imageUrl
    description
    parent
    depth
    createdAt
    updatedAt
  }
`;

export const GET_CATEGORIES_LIST = gql`
  query GetCategoriesList {
    categoriesList {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const GET_CATEGORIES_PAGE = gql`
  query GetCategoriesPage($limit: Int!, $page: Int!, $search: String) {
    categoriesPage(limit: $limit, page: $page, search: $search) {
      total
      totalPages
      page
      limit
      items {
        ...CategoryFields
      }
    }
  }
  ${CATEGORY_FIELDS}
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id: _id
    }
  }
`;
