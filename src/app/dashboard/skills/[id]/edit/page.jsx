import EditSkillScreen from '@/features/skills/screens/edit-skill-screen'

export default async function Page({ params }) {
  const { id } = await params
  return <EditSkillScreen skillId={Number(id)} />
}
