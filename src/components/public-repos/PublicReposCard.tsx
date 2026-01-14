import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui2/card';
import { SearchBar } from './SearchBar';

interface PublicRepoCardProps {
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children: React.ReactNode;
}

export function PublicReposCard({ isLoading, searchQuery, onSearchChange, children }: PublicRepoCardProps) {
  return (
    <Card className="w-full h-full flex flex-col bg-background">
      <CardHeader className="pb-2 p-4 sm:p-6 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">
              {isLoading ? `Loading Repos...` : `Public Repos...`}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Search and manage your repositories, files and folder
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-3 sm:mt-4">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 flex-1 overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
}
