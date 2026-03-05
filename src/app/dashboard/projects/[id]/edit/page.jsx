import EditProjectPage from '@/app/dashboard/projects/[id]/edit/edit-project-page'

export default async function Page({ params }) {
  const { id } = await params
  return <EditProjectPage projectId={id} />
}
