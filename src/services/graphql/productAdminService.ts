import { gql } from '@apollo/client';

export const GET_PRODUCTS_PAGE = gql`
  query GetProductsPage($limit: Int!, $page: Int!, $search: String) {
    productsPage(limit: $limit, page: $page, search: $search) {
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
        tags
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
      tags
      imageUrl
    }
  }
`;
