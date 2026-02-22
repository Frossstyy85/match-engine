'use server'

import { createClient } from '@/lib/supabase/server'

function normalizeId(value) {
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const parsed = Number(value)
    if (Number.isSafeInteger(parsed)) return parsed
  }

  return value
}

function mapTeamRow(row) {
  return {
    id: row.id,
    name: row.name ?? '',
    projectId: row.project_id ?? null
  }
}

export async function getTeams({ page, pageSize, query }) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()
  let queryBuilder = supabase
    .from('teams')
    .select('id, name, project_id', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (query) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`)
  }

  const { data, error, count } = await queryBuilder
  if (error) throw error

  const totalRows = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  return {
    rows: (data ?? []).map(mapTeamRow),
    totalPages
  }
}

export async function getTeamById(teamId) {
  const normalizedTeamId = normalizeId(teamId)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('teams')
    .select('id, name, project_id')
    .eq('id', normalizedTeamId)
    .maybeSingle()

  if (error) throw error
  return data ? mapTeamRow(data) : null
}

export async function getTeamMembers(teamId) {
  const normalizedTeamId = normalizeId(teamId)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('team_members')
    .select('profile_id, profiles(id, name, email)')
    .eq('team_id', normalizedTeamId)

  if (error) throw error

  const rows = data ?? []
  return rows
    .map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
      return profile
        ? {
            id: profile.id,
            name: profile.name ?? null,
            email: profile.email ?? null
          }
        : null
    })
    .filter(Boolean)
}

export async function getTeamMemberIds(teamId) {
  const normalizedTeamId = normalizeId(teamId)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('team_members')
    .select('profile_id')
    .eq('team_id', normalizedTeamId)

  if (error) throw error
  return (data ?? []).map((row) => row.profile_id)
}

export async function getProfiles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('id, name, email')

  if (error) throw error
  return data ?? []
}

export async function createTeam(name, projectId) {
  const teamName = name?.trim()
  if (!teamName) throw new Error('Team name is required')

  const supabase = await createClient()
  const payload = {
    name: teamName,
    project_id: projectId != null ? normalizeId(projectId) : null
  }

  const { data, error } = await supabase.from('teams').insert(payload).select('id').single()

  if (error) throw error
  return data?.id ?? null
}

export async function createTeamForProject(projectId, name) {
  return createTeam(name, projectId)
}

export async function deleteTeam(teamId) {
  const normalizedTeamId = normalizeId(teamId)
  const supabase = await createClient()

  const { data: team, error: fetchError } = await supabase
    .from('teams')
    .select('project_id')
    .eq('id', normalizedTeamId)
    .single()

  if (fetchError) throw fetchError

  const { error: deleteError } = await supabase.from('teams').delete().eq('id', normalizedTeamId)
  if (deleteError) throw deleteError

  return { projectId: team?.project_id ?? null }
}

export async function updateTeamMembers(teamId, memberIds) {
  const normalizedTeamId = normalizeId(teamId)
  const supabase = await createClient()

  const { error: deleteError } = await supabase.from('team_members').delete().eq('team_id', normalizedTeamId)
  if (deleteError) throw deleteError

  if (memberIds.length > 0) {
    const rows = memberIds.map((profileId) => ({ team_id: normalizedTeamId, profile_id: profileId }))
    const { error: insertError } = await supabase.from('team_members').insert(rows)
    if (insertError) throw insertError
  }
}

export async function assignMemberToTeam(memberId, teamId) {
  const normalizedMemberId = normalizeId(memberId)
  const normalizedTeamId = normalizeId(teamId)
  const supabase = await createClient()

  const { error: clearError } = await supabase.from('team_members').delete().eq('profile_id', normalizedMemberId)
  if (clearError) throw clearError

  const { error } = await supabase.from('team_members').insert({
    team_id: normalizedTeamId,
    profile_id: normalizedMemberId
  })

  if (error) throw error
}
