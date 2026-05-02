import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:       60 * 1000,       // 1 min — reduce redundant refetches
      gcTime:          5 * 60 * 1000,   // 5 min cache
      retry:           1,
      refetchOnWindowFocus: false,
    },
  },
})
