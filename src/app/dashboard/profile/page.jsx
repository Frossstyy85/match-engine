import ProfilePageClient from './ProfilePageClient'
import { createClient } from '@/lib/supabase/server'

const EMPTY_PROFILE_DATA = {
  profileId: null,
  name: '',
  email: '',
  skillsOptions: [],
  initialSkillNames: [],
  initialAvailability: [],
  certificatesOptions: [],
  initialCertificateNames: [],
  languagesOptions: [],
  initialLanguageNames: []
}

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

async function fetchProfilePageData(supabase, authId) {
  const { data: profileRow, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, email')
    .eq('auth_id', authId)
    .maybeSingle()

  if (profileError) throw profileError

  const profileId = profileRow?.id ?? null
  const data = {
    ...EMPTY_PROFILE_DATA,
    profileId,
    name: profileRow?.name ?? '',
    email: profileRow?.email ?? ''
  }

  if (!profileId) return data

  const [
    { data: skillsData },
    { data: profileSkillsData },
    { data: availabilityData },
    { data: certificatesData },
    { data: profileCertificatesData },
    { data: languagesData },
    { data: profileLanguagesData }
  ] = await Promise.all([
    supabase.from('skill_categories').select('id, name, skills(id, name)'),
    supabase.from('profile_skills').select('skills(id, name)').eq('profile_id', profileId),
    supabase.from('profile_availability').select('start_date, end_date').eq('profile_id', profileId),
    supabase.from('certificates').select('id, name'),
    supabase.from('profile_certificates').select('certificates(id, name)').eq('profile_id', profileId),
    supabase.from('languages').select('id, name'),
    supabase.from('profile_languages').select('languages(id, name)').eq('profile_id', profileId)
  ])

  return {
    ...data,
    skillsOptions: (skillsData ?? []).map(mapSkillCategoryRow),
    initialSkillNames: (profileSkillsData ?? []).map((row) => row.skills?.name).filter(Boolean),
    initialAvailability: (availabilityData ?? []).map((row) => ({
      start_date: row.start_date ?? null,
      end_date: row.end_date ?? null
    })),
    certificatesOptions: (certificatesData ?? []).map((row) => ({ id: row.id, name: row.name ?? '' })),
    initialCertificateNames: (profileCertificatesData ?? []).map((row) => row.certificates?.name).filter(Boolean),
    languagesOptions: (languagesData ?? []).map((row) => ({ id: row.id, name: row.name ?? '' })),
    initialLanguageNames: (profileLanguagesData ?? []).map((row) => row.languages?.name).filter(Boolean)
  }
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return (
      <ProfilePageClient authId={null} initialData={EMPTY_PROFILE_DATA} loadError={'Failed to load current user.'} />
    )
  }

  try {
    const initialData = await fetchProfilePageData(supabase, user.id)
    return <ProfilePageClient authId={user.id} initialData={initialData} />
  } catch {
    return <ProfilePageClient authId={user.id} initialData={EMPTY_PROFILE_DATA} loadError={'Failed to load profile.'} />
  }
}
