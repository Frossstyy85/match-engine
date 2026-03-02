import ProjectStaffingPage from '@/features/projects/app/project-staffing-page'

export default async function Page({ params }) {
  const { id } = await params
  return <ProjectStaffingPage projectId={id} />
}
