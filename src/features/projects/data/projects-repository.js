import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export function mapProjectRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    startDate: row.start_date ? new Date(row.start_date) : null,
    endDate: row.end_date ? new Date(row.end_date) : null,
    status: row.status ?? null
  }
}

export async function fetchProject(projectId) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_skills(skills(id, name)), teams(id, name)')
    .eq('id', projectId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const projectSkills = (data.project_skills ?? [])
    .map((projectSkill) => projectSkill.skills?.name ?? null)
    .filter(Boolean)

  const teams = (data.teams ?? []).map((team) => ({
    id: team.id,
    name: team.name ?? '',
    projectId: team.project_id ?? null
  }))

  return {
    ...mapProjectRow(data),
    projectSkills,
    teams
  }
}

export async function fetchProjectsPage({ page = 1, pageSize = 15, query } = {}) {
  const safePage = Math.max(1, Number(page) || 1)
  const safePageSize = Math.max(1, Number(pageSize) || 15)
  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  const supabase = await createClient()

  let queryBuilder = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: true })

  if (query) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`)
  }

  const { data, error, count } = await queryBuilder
  if (error) notFound()

  const totalRows = count ?? 0

  return {
    rows: (data ?? []).map(mapProjectRow),
    totalRows,
    totalPages: Math.max(1, Math.ceil(totalRows / safePageSize))
  }
}
