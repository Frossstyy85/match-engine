'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUsers({ page, pageSize, query }: { page: number; pageSize: number; query?: string }) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()
  let queryBuilder = supabase
    .from('profiles')
    .select('id, name, email', { count: 'exact' })
    .range(from, to)
    .order('name', { ascending: true })

  if (query) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`)
  }

  const { data, error, count } = await queryBuilder
  if (error) throw error

  const totalRows = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  return {
    rows: (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? null,
      email: row.email ?? null
    })),
    totalPages
  }
}

export async function getUserById(userId: unknown) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) throw error
  return data
}

