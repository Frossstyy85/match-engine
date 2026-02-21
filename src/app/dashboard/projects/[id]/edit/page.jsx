import EditProjectScreen from '@/features/projects/screens/edit-project-screen'

export default async function Page({ params }) {
  const { id } = await params
  return <EditProjectScreen projectId={Number(id)} />
}
