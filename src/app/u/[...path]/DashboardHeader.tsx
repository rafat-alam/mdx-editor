import { Skeleton } from '@/components/ui/skeleton';

interface User {
  name?: string;
  email?: string | null;
  repo_count?: number;
  last_active?: string | null;
}

interface Props {
  user: User | null | undefined;
}

export function DashboardHeader({ user }: Props) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
        {!user && (
          <>Hi, <Skeleton className="ml-2 h-10 sm:h-8 w-16 sm:w-20" /></>
        )}
        {user && user.email && (
          <>Hi, {user.name}</>
        )}
        {user && !user.email && (
          <>{user.name}</>
        )}
      </h1>
      <div className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
        {!user && (
          <Skeleton className="h-8 sm:h-6 w-72 sm:w-90" />
        )}
        {user && user.email && (
          <>Welcome back, Here&apos;s an overview of your activity.</>
        )}
        {user && !user.email && (
          <>Welcome back, Here&apos;s an overview of {user.name}'s activity.</>
        )}
      </div>
    </>
  );
}
