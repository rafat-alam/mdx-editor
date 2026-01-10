import { EditorPage } from '@/app/editor/[...path]/editor-page'

export default async function UserPage({ params }: { params: { path: string [] } }) {
  const { path } = await params;
  return <EditorPage path = {path}/>;
}