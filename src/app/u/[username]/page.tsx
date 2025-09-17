import { Dashboard } from "@/components/dashboard";

export default async function UserPage({ params }: { params: { username: string } }) {
  const { username } = await params;
  console.log(username);
  return <Dashboard />;
}