import { createClient } from '@/lib/supabase/server'

function mapSkillRow(row) {
  return { id: row.id, name: row.name ?? '' }
}

function mapSkillCategoryRow(row) {
  return {
    id: row.id,
    name: row.name ?? '',
    skills: (row.skills ?? []).map(mapSkillRow)
  }
}

export function mapSkillWithCategoryRow(row) {
  const category = Array.isArray(row.skill_categories)
    ? (row.skill_categories[0] ?? null)
    : (row.skill_categories ?? null)

  return {
    id: row.id,
    name: row.name ?? '',
    skillCategory: category ? { name: category.name } : null
  }
}

export async function fetchSkillsWithCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('skill_categories').select('id, name, skills(id, name)')

  if (error) throw error
  return (data ?? []).map(mapSkillCategoryRow)
}

export async function fetchSkillsPage({ page = 1, pageSize = 15 } = {}) {
  const safePage = Math.max(1, Number(page) || 1)
  const safePageSize = Math.max(1, Number(pageSize) || 15)
  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  const supabase = await createClient()
  const { data, error, count } = await supabase
    .from('skills')
    .select('id, name, skill_categories(name)', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) throw error

  const totalRows = count ?? 0

  return {
    rows: (data ?? []).map(mapSkillWithCategoryRow),
    totalRows,
    totalPages: Math.max(1, Math.ceil(totalRows / safePageSize))
  }
}

export async function fetchCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('skill_categories').select('id, name')

  if (error) throw error
  return (data ?? []).map((row) => ({ id: row.id, name: row.name ?? '' }))
}

export async function fetchSkill(skillId) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('id, name, category_id, skill_categories(name)')
    .eq('id', skillId)
    .maybeSingle()

  if (error) throw error
  return data ? mapSkillWithCategoryRow(data) : null
}
