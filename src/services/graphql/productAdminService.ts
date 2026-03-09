import { gql } from '@apollo/client';

export const GET_PRODUCTS_PAGE = gql`
  query GetProductsPage(
    $limit: Int!
    $page: Int!
    $search: String
    $sort: ProductSortField
    $order: SortOrder
  ) {
    productsPage(
      limit: $limit
      page: $page
      search: $search
      sort: $sort
      order: $order
    ) {
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
