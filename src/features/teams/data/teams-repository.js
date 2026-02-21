import { createClient } from '@/lib/supabase/server'

export function mapTeamRow(row) {
  return {
    id: row.id,
    name: row.name ?? '',
    projectId: row.project_id ?? null
  }
}

export async function fetchTeam(teamId) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('teams').select('id, name, project_id').eq('id', teamId).maybeSingle()

  if (error) throw error
  return data ? mapTeamRow(data) : null
}

export async function fetchTeamsPage({ page = 1, pageSize = 15 } = {}) {
  const safePage = Math.max(1, Number(page) || 1)
  const safePageSize = Math.max(1, Number(pageSize) || 15)
  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  const supabase = await createClient()
  const { data, error, count } = await supabase
    .from('teams')
    .select('id, name, project_id', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) throw error

  const totalRows = count ?? 0

  return {
    rows: (data ?? []).map(mapTeamRow),
    totalRows,
    totalPages: Math.max(1, Math.ceil(totalRows / safePageSize))
  }
}
