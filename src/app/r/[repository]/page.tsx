import { YourRepo } from "@/components/your-repo";

export default async function UserPage({ params }: { params: { repository: string } }) {
  const { repository } = await params;
  console.log(repository);
  return <YourRepo />;
}