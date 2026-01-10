import { RepoHeader } from './RepoHeader';
import { RepoMetadata } from './RepoMetadata';
import { RepoActions } from './RepoActions';

interface Repo {
  owner_username: string;
  node_name: string;
  last_updated: string;
}

interface RepoItemProps {
  repo: Repo;
  onNavigate: (path: string) => void;
}

export function RepoItem({ repo, onNavigate }: RepoItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-3 last:border-0 gap-2 sm:gap-0">
      <div className="max-w-full sm:max-w-[60%]">
        <RepoHeader ownerUsername={repo.owner_username} nodeName={repo.node_name} />
        <RepoMetadata lastUpdated={repo.last_updated} />
      </div>
      <RepoActions
        ownerUsername={repo.owner_username}
        nodeName={repo.node_name}
        onNavigate={onNavigate}
      />
    </div>
  );
}
