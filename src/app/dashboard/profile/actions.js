'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveProfileName(_prev, formData) {
  const authId = formData.get('auth_id')
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { status: 'error', message: 'Name is required.' }
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', authId).maybeSingle()
  if (!profile) return { status: 'error', message: 'Profile not found' }
  const { error } = await supabase.from('profiles').update({ name }).eq('id', profile.id)
  if (error) return { status: 'error', message: 'Failed to save.' }
  revalidatePath('/dashboard/profile')
  return { status: 'success', message: 'Saved.' }
}

export async function saveProfileSkills(_prev, formData) {
  const authId = formData.get('auth_id')
  const skillNames = formData.getAll('skill_names').map((s) => String(s).trim()).filter(Boolean)
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', authId).maybeSingle()
  if (!profile) return { status: 'error', message: 'Profile not found' }
  const { data: skills } = await supabase.from('skills').select('id, name').in('name', skillNames)
  const ids = (skills ?? []).map((s) => s.id)
  await supabase.from('profile_skills').delete().eq('profile_id', profile.id)
  if (ids.length) await supabase.from('profile_skills').insert(ids.map((skill_id) => ({ profile_id: profile.id, skill_id })))
  revalidatePath('/dashboard/profile')
  return { status: 'success', message: 'Saved.' }
}

export async function saveProfileLanguages(_prev, formData) {
  const authId = formData.get('auth_id')
  const languageNames = formData.getAll('language_names').map((s) => String(s).trim()).filter(Boolean)
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', authId).maybeSingle()
  if (!profile) return { status: 'error', message: 'Profile not found' }
  const { data: languages } = await supabase.from('languages').select('id, name').in('name', languageNames)
  const ids = (languages ?? []).map((l) => l.id)
  await supabase.from('profile_languages').delete().eq('profile_id', profile.id)
  if (ids.length) await supabase.from('profile_languages').insert(ids.map((language_id) => ({ profile_id: profile.id, language_id })))
  revalidatePath('/dashboard/profile')
  return { status: 'success', message: 'Saved.' }
}

export async function saveProfileCertificates(_prev, formData) {
  const authId = formData.get('auth_id')
  const certNames = formData.getAll('certificate_names').map((s) => String(s).trim()).filter(Boolean)
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', authId).maybeSingle()
  if (!profile) return { status: 'error', message: 'Profile not found' }
  const { data: certs } = await supabase.from('certificates').select('id, name').in('name', certNames)
  const ids = (certs ?? []).map((c) => c.id)
  await supabase.from('profile_certificates').delete().eq('profile_id', profile.id)
  if (ids.length) await supabase.from('profile_certificates').insert(ids.map((certificate_id) => ({ profile_id: profile.id, certificate_id })))
  revalidatePath('/dashboard/profile')
  return { status: 'success', message: 'Saved.' }
}
