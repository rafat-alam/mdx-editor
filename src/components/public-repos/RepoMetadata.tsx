import { Calendar } from 'lucide-react';
import { formatDate } from './utils';

interface RepoMetadataProps {
  lastUpdated: string;
}

export function RepoMetadata({ lastUpdated }: RepoMetadataProps) {
  return (
    <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-1 sm:gap-0">
      <div className="flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{formatDate(lastUpdated)}</span>
      </div>
      <span className="mx-1 sm:mx-2 hidden sm:inline">•</span>
      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
        REPO
      </span>
    </div>
  );
}
