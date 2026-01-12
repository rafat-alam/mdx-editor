import { Dashboard } from "@/components/dashboard";

export default async function UserPage({ 
  params 
}: { 
  params: { path: string[] } 
}) {
  const { path } = await params;
  
  return <Dashboard path={path} />;
}
