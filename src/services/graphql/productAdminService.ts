import { gql } from '@apollo/client';

export const GET_PRODUCTS_PAGE = gql`
  query GetProductsPage($limit: Int!, $page: Int!) {
    productsPage(limit: $limit, page: $page) {
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
      }
    }
  }
`;
