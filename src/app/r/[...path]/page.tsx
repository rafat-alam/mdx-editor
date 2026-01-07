import { Dashboard } from "@/app/r/[...path]/dashboard";

export default async function UserPage({ params }: { params: { path: string [] } }) {
  const { path } = await params;
  return <Dashboard path = {path}/>;
}