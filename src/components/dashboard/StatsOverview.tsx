import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui2/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookMarked, Clock } from 'lucide-react';

interface UserInterface {
  username: string;
  name: string;
  email: null | string;
  last_active: string;
  repo_count: number;
}

interface StatsOverviewProps {
  loadingUser: boolean;
  isAdmin: boolean;
  user: UserInterface | undefined;
}

export function StatsOverview({ loadingUser, isAdmin, user }: StatsOverviewProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Card No of Repositories */}
      <Card className="h-full bg-background">
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-medium">
            Repositories
          </CardTitle>
          {loadingUser && (
            <div className="text-xs sm:text-sm">
              <Skeleton className="h-7 sm:h-5 w-72 sm:w-90" />
            </div>
          )}
          {!loadingUser && isAdmin && (
            <CardDescription className="text-xs sm:text-sm">
              Your saved Repositories
            </CardDescription>
          )}
          {!loadingUser && !isAdmin && (
            <CardDescription className="text-xs sm:text-sm">
              {user?.name}'s saved Repositories
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="flex items-center">
            <BookMarked className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-3" />
            {loadingUser ? (
              <Skeleton className="h-7 sm:h-9 w-16 sm:w-20" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold">{user?.repo_count}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card Last Active */}
      <Card className="h-full bg-background">
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-medium">
            Last Active
          </CardTitle>
          {loadingUser && (
            <div className="text-xs sm:text-sm">
              <Skeleton className="h-7 sm:h-5 w-72 sm:w-90" />
            </div>
          )}
          {!loadingUser && isAdmin && (
            <CardDescription className="text-xs sm:text-sm">
              Your previous session
            </CardDescription>
          )}
          {!loadingUser && !isAdmin && (
            <CardDescription className="text-xs sm:text-sm">
              {user?.name}'s previous session
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="flex items-center">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-3" />
            {loadingUser ? (
              <Skeleton className="h-7 sm:h-9 w-16 sm:w-20" />
            ) : (
              <span className="text-base sm:text-lg">
                {user?.last_active ? formatDate(user.last_active) : 'First Session'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
