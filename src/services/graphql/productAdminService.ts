import { gql } from '@apollo/client';

export const GET_PRODUCTS_PAGE = gql`
  query GetProductsPage(
    $limit: Int!
    $page: Int!
    $search: String
    $filter: ProductsFilterInput
  ) {
    productsPage(limit: $limit, page: $page, search: $search, filter: $filter) {
      total
      totalPages
      page
      limit
      items {
        id
        title
        price
        status
        description
        categories
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      price
      description
      categories
      productCode
      imageUrl
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      title
      price
      status
      description
      categories
      imageUrl
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      price
      description
      categories
      imageUrl
    }
  }
`;
