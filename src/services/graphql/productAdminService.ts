import { gql } from '@apollo/client';

export const GET_PRODUCTS_PAGE = gql`
  query GetProductsPage(
    $limit: Int!
    $page: Int!
    $search: String
    $sort: ProductSortField
    $order: SortOrder
    $filter: ProductsFilterInput
  ) {
    productsPage(
      limit: $limit
      page: $page
      search: $search
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
      updatedAt
      status
      description
      categories
      productCode
      imageUrl
      imagePublicId
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
      imagePublicId
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      price
      status
      description
      categories
      imageUrl
      imagePublicId
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const DUPLICATE_PRODUCT = gql`
  mutation DuplicateProduct($id: ID!) {
    duplicateProduct(id: $id) {
      id
      title
      price
      status
      productCode
      imageUrl
    }
  }
`;
