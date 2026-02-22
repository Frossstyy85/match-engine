import ProfileCertificatesForm from '@/app/dashboard/profile/ProfileCertificatesForm'
import ProfileIdentityForm from '@/app/dashboard/profile/ProfileIdentityForm'
import ProfileLanguagesForm from '@/app/dashboard/profile/ProfileLanguagesForm'
import ProfileSkillsForm from '@/app/dashboard/profile/ProfileSkillsForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) notFound()
  const { data: profile } = await supabase.from('profiles').select('name, email').eq('auth_id', user.id).maybeSingle()
  return (
    <div className="space-y-6">
      <ProfileIdentityForm id={user.id} name={profile?.name ?? ''} email={profile?.email ?? user.email ?? ''} />
      <ProfileSkillsForm id={user.id} />
      <ProfileCertificatesForm id={user.id} />
      <ProfileLanguagesForm id={user.id} />
    </div>
  )
}