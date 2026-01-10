import { Button } from '@/components/ui2/button';

interface RepoActionsProps {
  ownerUsername: string;
  nodeName: string;
  onNavigate: (path: string) => void;
}

export function RepoActions({ ownerUsername, nodeName, onNavigate }: RepoActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-0 justify-between sm:justify-end">
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            onNavigate(`u/${ownerUsername}/${nodeName}`);
          }}
          className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border border-input"
        >
          View
        </Button>
      </div>
    </div>
  );
}
