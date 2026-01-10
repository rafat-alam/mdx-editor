import { Button } from '@/components/ui2/button';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export function EmptyState({ searchQuery, onClearSearch }: EmptyStateProps) {
  return (
    <div className="text-center py-4 sm:py-6">
      <div>
        <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
        <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
          {`No Repositories found matching "${searchQuery}"`}
        </p>
        <Button variant="outline" onClick={onClearSearch} className="text-xs sm:text-sm">
          Clear Search
        </Button>
      </div>
    </div>
  );
}
