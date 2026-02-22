import ProjectDetailsPage from '@/features/projects/app/project-details-page'

export default async function Page({ params }) {
  const { id } = await params
  return <ProjectDetailsPage projectId={id} />
}
