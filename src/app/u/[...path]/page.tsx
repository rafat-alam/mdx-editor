import { Dashboard } from "@/app/u/[...path]/dashboard";

export default async function UserPage({ params }: { params: { path: string [] } }) {
  const { path } = await params;
  return <Dashboard path = {path}/>;
}