import { createClient } from '@/lib/supabase/server'

export async function fetchDashboardRole() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('auth_id', user.id).single()

  return profile?.role ?? null
}

export async function fetchAdminDashboardData() {
  const supabase = await createClient()

  const [
    { count: projectCount },
    { count: userCount },
    { count: teamCount },
    { data: latestProjects },
    { data: latestUsers },
    { data: latestTeams }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('id, name, created_at').order('created_at', { ascending: false }).limit(3),
    supabase.from('profiles').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(3),
    supabase.from('teams').select('id, name, created_at').order('created_at', { ascending: false }).limit(3)
  ])

  return {
    counts: {
      projects: projectCount ?? 0,
      users: userCount ?? 0,
      teams: teamCount ?? 0
    },
    latestProjects: latestProjects ?? [],
    latestUsers: latestUsers ?? [],
    latestTeams: latestTeams ?? []
  }
}
