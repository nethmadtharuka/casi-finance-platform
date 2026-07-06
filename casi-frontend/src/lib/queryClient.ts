import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

// Central place for query key naming — keeps invalidation calls consistent
// across hooks instead of hand-typing key arrays in each mutation.
export const queryKeys = {
  categories: ['categories'] as const,
  expenses: (month: string, categoryId?: number) =>
    ['expenses', month, categoryId ?? null] as const,
  budgetSummary: (month: string) => ['budgetSummary', month] as const,
  dashboard: (month: string) => ['dashboard', month] as const,
}
