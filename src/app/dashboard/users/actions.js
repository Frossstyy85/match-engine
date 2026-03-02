'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveUserName(_prev, formData) {
  const profileId = formData.get('profile_id')
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { status: 'error', message: 'Name is required.' }
  if (!profileId) return { status: 'error', message: 'Profile not found' }

  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ name }).eq('id', profileId)
  if (error) return { status: 'error', message: 'Failed to save.' }

  revalidatePath('/dashboard/users')
  return { status: 'success', message: 'Saved.' }
}

export async function saveUserSkills(_prev, formData) {
  const profileId = formData.get('profile_id')
  const skillNames = formData.getAll('skill_names').map((s) => String(s).trim()).filter(Boolean)
  if (!profileId) return { status: 'error', message: 'Profile not found' }

  const supabase = await createClient()
  const { data: skills } = await supabase.from('skills').select('id, name').in('name', skillNames)
  const ids = (skills ?? []).map((s) => s.id)

  await supabase.from('profile_skills').delete().eq('profile_id', profileId)
  if (ids.length) {
    await supabase.from('profile_skills').insert(ids.map((skill_id) => ({ profile_id: profileId, skill_id })))
  }

  revalidatePath('/dashboard/users')
  return { status: 'success', message: 'Saved.' }
}

export async function saveUserLanguages(_prev, formData) {
  const profileId = formData.get('profile_id')
  const languageNames = formData.getAll('language_names').map((s) => String(s).trim()).filter(Boolean)
  if (!profileId) return { status: 'error', message: 'Profile not found' }

  const supabase = await createClient()
  const { data: languages } = await supabase.from('languages').select('id, name').in('name', languageNames)
  const ids = (languages ?? []).map((l) => l.id)

  await supabase.from('profile_languages').delete().eq('profile_id', profileId)
  if (ids.length) {
    await supabase
      .from('profile_languages')
      .insert(ids.map((language_id) => ({ profile_id: profileId, language_id })))
  }

  revalidatePath('/dashboard/users')
  return { status: 'success', message: 'Saved.' }
}

export async function saveUserCertificates(_prev, formData) {
  const profileId = formData.get('profile_id')
  const certNames = formData.getAll('certificate_names').map((s) => String(s).trim()).filter(Boolean)
  if (!profileId) return { status: 'error', message: 'Profile not found' }

  const supabase = await createClient()
  const { data: certs } = await supabase.from('certificates').select('id, name').in('name', certNames)
  const ids = (certs ?? []).map((c) => c.id)

  await supabase.from('profile_certificates').delete().eq('profile_id', profileId)
  if (ids.length) {
    await supabase
      .from('profile_certificates')
      .insert(ids.map((certificate_id) => ({ profile_id: profileId, certificate_id })))
  }

  revalidatePath('/dashboard/users')
  return { status: 'success', message: 'Saved.' }
}

