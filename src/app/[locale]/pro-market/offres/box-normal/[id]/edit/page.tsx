import EditBoxWrapper from '../../../components/EditBoxWrapper'

export default async function EditBoxNormalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <div>
      <EditBoxWrapper
        id={id}
        type='normal'
      />
    </div>
  )
}
