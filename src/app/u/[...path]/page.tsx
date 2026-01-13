import { Dashboard } from "@/components/dashboard";

export default async function UserPage({
  params,
  searchParams,
}: {
  params: { path: string[] };
  searchParams: { m?: string };
}) {
  const { path } = await params;

  let { m } = await searchParams;
  let val: number = 0;
  if (m !== undefined) {
    const num = Number(m);
    if (!Number.isNaN(num)) {
      val = num;
    }
  }

  return <Dashboard path={path} m={val} />;
}