import { Skeleton } from '@/components/ui/skeleton';

interface UserInterface {
  username: string;
  name: string;
  email: null | string;
  last_active: string;
  repo_count: number;
}

interface DashboardHeaderProps {
  loadingUser: boolean;
  isAdmin: boolean;
  user: UserInterface | undefined;
}

export function DashboardHeader({ loadingUser, isAdmin, user }: DashboardHeaderProps) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
        {loadingUser && (
          <>Hi, <Skeleton className="ml-2 h-10 sm:h-8 w-16 sm:w-20" /></>
        )}
        {!loadingUser && isAdmin && (
          <>Hi, {user?.name}</>
        )}
        {!loadingUser && !isAdmin && (
          <>{user?.name}</>
        )}
      </h1>
      <div className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
        {loadingUser && (
          <Skeleton className="h-8 sm:h-6 w-72 sm:w-90" />
        )}
        {!loadingUser && isAdmin && (
          <>Welcome back, Here&apos;s an overview of your activity.</>
        )}
        {!loadingUser && !isAdmin && (
          <>Welcome back, Here&apos;s an overview of {user?.name}'s activity.</>
        )}
      </div>
    </>
  );
}
