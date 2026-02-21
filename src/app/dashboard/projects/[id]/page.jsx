import ProjectDetailsScreen from '@/features/projects/screens/project-details-screen'

export default async function Page({ params }) {
  const { id } = await params
  return <ProjectDetailsScreen projectId={Number(id)} />
}
