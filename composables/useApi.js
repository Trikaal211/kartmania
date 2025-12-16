// ~/composables/useApi.js
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useProductFilter = (variables = {}) => {
  const PRODUCT_FILTER_QUERY = gql`
    query ProductFilter($category: String, $sortBy: String, $page: Int, $perPage: Int) {
      productFilter(category: $category, sortBy: $sortBy, page: $page, perPage: $perPage) {
        data {
          id
          name
          price
          discountValue
          stock
          popularity
          brand { name }
          category { name }
          images {
            isPrimary
            imageUrl
          }
          reviews {
            rating
            review
          }
          attributes {
            id
            color
            size
          }
        }
        pagination {
          currentPage
          lastPage
          total
          perPage
          hasNextPage
          hasPrevPage
          from
          to
        }
      }
    }
  `

  return useQuery(PRODUCT_FILTER_QUERY, variables)
}