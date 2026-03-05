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
      }
    }
  }
`;
