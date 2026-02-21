import { createClient } from '@/lib/supabase/server'

export function mapUserRow(row) {
  return {
    id: row.id,
    name: row.name ?? null,
    email: row.email ?? null
  }
}

export async function fetchUsersPage({ page = 1, pageSize = 15 } = {}) {
  const safePage = Math.max(1, Number(page) || 1)
  const safePageSize = Math.max(1, Number(pageSize) || 15)
  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  const supabase = await createClient()
  const { data, error, count } = await supabase
    .from('profiles')
    .select('id, name, email', { count: 'exact' })
    .range(from, to)
    .order('name', { ascending: true })

  if (error) throw error

  const totalRows = count ?? 0

  return {
    rows: (data ?? []).map(mapUserRow),
    totalRows,
    totalPages: Math.max(1, Math.ceil(totalRows / safePageSize))
  }
}

export async function fetchUser(userId) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) throw error
  return data
}
