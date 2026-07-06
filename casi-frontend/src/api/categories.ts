import { api } from '@/lib/axios'
import type { Category } from '@/types/category'

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/categories')
  return data
}
