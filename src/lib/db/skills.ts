'use server'

import { createClient } from '@/lib/supabase/server'

function mapSkillRow(row: any) {
  return { id: row.id, name: row.name ?? '' }
}

function mapSkillCategoryRow(row: any) {
  return {
    id: row.id,
    name: row.name ?? '',
    skills: (row.skills ?? []).map(mapSkillRow)
  }
}

function mapSkillWithCategoryRow(row: any) {
  const category = Array.isArray(row.skill_categories)
    ? (row.skill_categories[0] ?? null)
    : (row.skill_categories ?? null)

  return {
    id: row.id,
    name: row.name ?? '',
    categoryId: row.category_id ?? category?.id ?? null,
    skillCategory: category ? { name: category.name } : null
  }
}

export async function getSkillsWithCategory() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('skill_categories').select('id, name, skills(id, name)')

  if (error) throw error
  return (data ?? []).map(mapSkillCategoryRow)
}

export async function getSkills({ page, pageSize, query }: { page: number; pageSize: number; query?: string }) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  let skillsQuery = supabase
    .from('skills')
    .select('id, name, category_id, skill_categories(id, name)', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (query) {
    skillsQuery = skillsQuery.ilike('name', `%${query}%`)
  }

  const [{ data: skillRows, error: skillsError, count }, { data: categoryRows, error: categoriesError }] =
    await Promise.all([skillsQuery, supabase.from('skill_categories').select('id, name')])

  if (skillsError) throw skillsError
  if (categoriesError) throw categoriesError

  const totalRows = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  return {
    rows: (skillRows ?? []).map(mapSkillWithCategoryRow),
    categories: (categoryRows ?? []).map((row) => ({ id: row.id, name: row.name ?? '' })),
    totalPages
  }
}

export async function getSkillById(skillId: unknown) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('skills').select('id, name, category_id').eq('id', skillId).maybeSingle()

  if (error) throw error

  if (!data) return null

  return {
    id: data.id,
    name: data.name ?? '',
    categoryId: data.category_id ?? null
  }
}

export async function createSkill(name: string, categoryId: number) {
  if (!name.trim()) throw new Error('Skill name is required')

  const supabase = await createClient()
  const { error } = await supabase.from('skills').insert({
    name: name.trim(),
    category_id: categoryId
  })

  if (error) throw error
}

export async function updateSkill(skillId: unknown, name: string, categoryId: number) {
  if (!name.trim()) throw new Error('Skill name is required')
  if (!categoryId) throw new Error('Skill category is required')

  const supabase = await createClient()
  const { error } = await supabase
    .from('skills')
    .update({
      name: name.trim(),
      category_id: categoryId
    })
    .eq('id', skillId)

  if (error) throw error
}

export async function deleteSkillBy(skillId: unknown) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().eq('id', skillId)
  if (error) throw error
}
