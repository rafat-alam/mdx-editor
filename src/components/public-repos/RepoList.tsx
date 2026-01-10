import { RepoItem } from './RepoItem';

interface Repo {
  owner_username: string;
  node_name: string;
  last_updated: string;
}

interface RepoListProps {
  repos: Repo[];
  onNavigate: (path: string) => void;
}

export function RepoList({ repos, onNavigate }: RepoListProps) {
  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <RepoItem
          key={repo.node_name}
          repo={repo}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
