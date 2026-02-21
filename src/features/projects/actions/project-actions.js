'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createProject(formData) {
  const name = formData.get('name')
  const description = formData.get('description')?.trim() || null
  const startDate = formData.get('start_date') || null
  const endDate = formData.get('end_date') || null

  if (!name || name.trim().length === 0) {
    throw new Error('Project name is required')
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: name.trim(),
      description,
      start_date: startDate,
      end_date: endDate
    })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath('/dashboard/projects')
  if (data.id) redirect(`/dashboard/projects/${data.id}`)
}

export async function updateProject(projectId, fields, skillNames) {
  const supabase = await createClient()

  const { error: projectError } = await supabase
    .from('projects')
    .update({
      name: fields.name,
      description: fields.description || null,
      start_date: fields.start_date || null,
      end_date: fields.end_date || null
    })
    .eq('id', projectId)

  if (projectError) throw projectError

  const { error: deleteError } = await supabase.from('project_skills').delete().eq('project_id', projectId)

  if (deleteError) throw deleteError

  if (skillNames.length > 0) {
    const { data: skillRows, error: skillsError } = await supabase.from('skills').select('id').in('name', skillNames)

    if (skillsError) throw skillsError

    if (skillRows && skillRows.length > 0) {
      const { error: insertError } = await supabase.from('project_skills').insert(
        skillRows.map((skill) => ({
          project_id: projectId,
          skill_id: skill.id
        }))
      )

      if (insertError) throw insertError
    }
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath(`/dashboard/projects/${projectId}/edit`)
}

export async function deleteProject(projectId) {
  const supabase = await createClient()

  const { error: teamsError } = await supabase.from('teams').delete().eq('project_id', projectId)
  if (teamsError) throw teamsError

  const { error: projectError } = await supabase.from('projects').delete().eq('id', projectId)
  if (projectError) throw projectError

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}
