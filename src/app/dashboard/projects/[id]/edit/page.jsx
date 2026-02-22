import EditProjectPage from '@/features/projects/app/edit-project-page'

export default async function Page({ params }) {
  const { id } = await params
  return <EditProjectPage projectId={id} />
}
