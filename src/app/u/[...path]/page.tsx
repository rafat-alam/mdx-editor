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
  let val: boolean = false;
  if(m && m == "1") {
    val = true;
  }

  return <Dashboard path={path} m={val} />;
}