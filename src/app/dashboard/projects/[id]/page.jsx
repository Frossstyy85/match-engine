import ProjectDetailsPage from '@/app/dashboard/projects/[id]/project-details-page'

export default async function Page({ params }) {
  const { id } = await params
  return <ProjectDetailsPage projectId={id} />
}
