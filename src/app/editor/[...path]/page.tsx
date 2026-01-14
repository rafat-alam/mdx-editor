import { Editor } from '@/components/editor';

export default async function UserPage({ params }: { params: { path: string [] } }) {
  const { path } = await params;
  return <Editor path = {path}/>;
}
