import ProjectStaffingPage from '@/app/dashboard/projects/[id]/staffing/project-staffing-page'

export default async function Page({ params }) {
  const { id } = await params
  return <ProjectStaffingPage projectId={id} />
}
