import { Button } from '@/components/ui2/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Globe, Lock, FileCode, Trash2 } from 'lucide-react';

interface _Node {
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: null | boolean;
  last_updated: string;
}

interface RepositoryListProps {
  items: _Node[];
  path: string[];
  isAdmin: boolean;
  disableSwitch: string;
  pathname: string;
  onFolderClick: (folderName: string) => void;
  onFileClick: (fileName: string) => void;
  onDeleteClick: (nodeName: string) => void;
  onTogglePublicStatus: (checked: boolean, repo: _Node) => void;
}

export function RepositoryList({
  items,
  path,
  isAdmin,
  disableSwitch,
  pathname,
  onFolderClick,
  onFileClick,
  onDeleteClick,
  onTogglePublicStatus,
}: RepositoryListProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {items.map((repo) => (
        <div key={repo.node_name} className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-3 last:border-0 gap-2 sm:gap-0">
          <div className="max-w-full sm:max-w-[60%]">
            <h3 className="font-medium text-sm sm:text-base truncate">{repo.node_name}</h3>
            <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-1 sm:gap-0">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(repo.last_updated)}</span>
              </div>
              <span className="mx-1 sm:mx-2 hidden sm:inline">•</span>
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {path.length === 1 ? 'REPO' : repo.node_type}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-0 justify-between sm:justify-end">
            {path.length == 1 && isAdmin && <div className="flex items-center">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Switch
                  id={`public-toggle-${repo.node_name}`}
                  checked={!!repo.is_public}
                  onCheckedChange={(checked: boolean) => onTogglePublicStatus(checked, repo)}
                  className="scale-75 sm:scale-100"
                  disabled={repo.node_name == disableSwitch ? true : false}
                />
                <Label htmlFor={`public-toggle-${repo.node_name}`} className="text-xs sm:text-sm cursor-pointer">
                  {repo.is_public ? (
                    <span className="flex items-center text-green-600">
                      <Globe className="h-3 w-3 mr-1" />
                      <span className="hidden xs:inline">Public</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-muted-foreground">
                      <Lock className="h-3 w-3 mr-1" />
                      <span className="hidden xs:inline">Private</span>
                    </span>
                  )}
                </Label>
              </div>
            </div>}
            <div className="flex items-center gap-1">
              { repo.node_type == 'FOLDER' && <Button
                size="sm"
                variant="ghost"
                onClick={() => onFolderClick(repo.node_name)}
                className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border border-input"
                >
                View
              </Button> }
              { repo.node_type == 'FILE' && <Button
                size="sm"
                variant="ghost"
                onClick={() => onFileClick(repo.node_name)}
                className="hover:bg-primary/10 hover:text-primary h-7 sm:h-9 w-7 sm:w-9 p-0 border border-input"
              >
                <FileCode className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button> }
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 sm:h-9 w-7 sm:w-9 p-0 border border-input"
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteClick(repo.node_name);
                }}
                disabled={!isAdmin}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
