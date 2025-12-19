// import { useQuery, useMutation } from '@urql/vue'

// export const useGraphQLQuery = (options) => {
//   const { $graphqlClient } = useNuxtApp()
  
//   return useQuery({
//     ...options,
//     client: $graphqlClient
//   })
// }

// export const useGraphQLMutation = (mutation) => {
//   const { $graphqlClient } = useNuxtApp()
  
//   return (variables) => {
//     return $graphqlClient.mutation(mutation, variables).toPromise()
//   }
// }