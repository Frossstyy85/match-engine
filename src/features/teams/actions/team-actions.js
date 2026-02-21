'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createTeam(formData) {
  const name = formData.get('name')
  if (!name || name.trim().length === 0) {
    throw new Error('Team name is required')
  }

  const supabase = await createClient()
  const {
    data: { id },
    error
  } = await supabase.from('teams').insert({ name }).select('id').single()

  if (error) throw error

  revalidatePath('/dashboard/teams')
  if (id) redirect(`/dashboard/teams/${id}`)
}

export async function createTeamForProject(projectId, formData) {
  const name = formData.get('name')?.trim()
  if (!name) {
    throw new Error('Team name is required')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('teams').insert({ name, project_id: projectId }).select('id').single()

  if (error) throw error

  revalidatePath('/dashboard/teams')
  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath(`/dashboard/projects/${projectId}/edit`)
}

export async function deleteTeam(teamId) {
  const supabase = await createClient()

  const { data: team, error: fetchError } = await supabase.from('teams').select('project_id').eq('id', teamId).single()

  if (fetchError) throw fetchError

  const { error: deleteError } = await supabase.from('teams').delete().eq('id', teamId)
  if (deleteError) throw deleteError

  revalidatePath('/dashboard/teams')

  if (team?.project_id != null) {
    revalidatePath(`/dashboard/projects/${team.project_id}`)
    revalidatePath(`/dashboard/projects/${team.project_id}/edit`)
  }
}

export async function updateTeamMembers(teamId, memberIds) {
  const supabase = await createClient()

  const { error: clearError } = await supabase.from('profiles').update({ team_id: null }).eq('team_id', teamId)

  if (clearError) throw clearError

  if (memberIds.length > 0) {
    const { error: assignError } = await supabase.from('profiles').update({ team_id: teamId }).in('id', memberIds)

    if (assignError) throw assignError
  }

  revalidatePath('/dashboard/teams')
  revalidatePath(`/dashboard/teams/${teamId}`)
}
