import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui2/card';
import { Button } from '@/components/ui2/button';
import { Input } from '@/components/ui2/input';
import { Search, Undo2, Minimize2, Maximize2, User2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RepositoryList } from './RepositoryList';

interface _Node {
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: null | boolean;
  last_updated: string;
}

interface UserInterface {
  username: string;
  name: string;
  email: null | string;
  last_active: string;
  repo_count: number;
}

interface RepositoriesCardProps {
  path: string[];
  mode: number;
  searchQuery: string;
  node: _Node[] | undefined;
  loadingContent: boolean;
  loadingUser: boolean;
  isAdmin: boolean;
  user: UserInterface | undefined;
  disableSwitch: string;
  pathname: string;
  onModeToggle: () => void;
  onSearchChange: (query: string) => void;
  onBackClick: () => void;
  onFolderClick: (folderName: string) => void;
  onFileClick: (fileName: string) => void;
  onDeleteClick: (nodeName: string) => void;
  onTogglePublicStatus: (checked: boolean, repo: _Node) => void;
  onAddRepoClick: () => void;
  onAddFolderClick: () => void;
  onAddFileClick: () => void;
}

export function RepositoriesCard({
  path,
  mode,
  searchQuery,
  node,
  loadingContent,
  loadingUser,
  isAdmin,
  user,
  disableSwitch,
  pathname,
  onModeToggle,
  onSearchChange,
  onBackClick,
  onFolderClick,
  onFileClick,
  onDeleteClick,
  onTogglePublicStatus,
  onAddRepoClick,
  onAddFolderClick,
  onAddFileClick,
}: RepositoriesCardProps) {
  return (
    <Card className={mode == 1 ? 'bg-background' : 'w-full h-full flex flex-col bg-background'}>
      <CardHeader className={mode == 1 ? "pb-2 p-4 sm:p-6" : 'pb-2 p-4 sm:p-6 shrink-0'}>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className="text-base sm:text-lg">
              {path.length == 1 ?
                (loadingContent ? `Loading Repos...` :
                  (!isAdmin ? `${user?.name}'s Repos...` : `Your Repos...`)) :
              `Inside folder : ${path[path.length - 1]}`}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Search and manage your repositories, files and folder
            </CardDescription>
          </div>
          {path.length == 1 && <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onModeToggle}
              className="h-8 w-8 p-0"
              title={mode == 0 ? "Exit Fullscreen" : "Fullscreen"}
            >
              {mode == 0 ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          </div>}
          {path.length !== 1 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href={`/u/${path[0]}`}
                title="Go to profile"
                className="
                  inline-flex items-center gap-1.5
                  px-2 py-1 rounded-md
                  transition-colors
                  hover:bg-muted hover:text-foreground
                "
              >
                <User2 size={15} className="opacity-80" />
                <span className="font-medium">
                  {loadingUser ? "Loading…" : user?.name}
                </span>
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 mt-3 sm:mt-4">
          <div>
            <Button 
              variant={"outline"}
              disabled={(path.length == 1)} 
              onClick={onBackClick}
            >
              <Undo2 className='h-4 w-4 sm:h-5 sm:w-5 mr-2'/>
                Back
            </Button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
            <Input
              type="text"
              placeholder="Search in your repositories, files and folders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className={mode == 1 ? "p-4 sm:p-6" : "p-4 sm:p-6 flex-1 overflow-auto"}>
        {(() => {
          if(loadingContent) {
            return <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          }

          const filteredItems = node?.filter(item =>
            item.node_name.toLowerCase().includes(searchQuery.trim().toLowerCase())
          );

          if(filteredItems?.length! > 0) {
            return <RepositoryList
              items={filteredItems!}
              path={path}
              isAdmin={isAdmin}
              disableSwitch={disableSwitch}
              pathname={pathname}
              onFolderClick={onFolderClick}
              onFileClick={onFileClick}
              onDeleteClick={onDeleteClick}
              onTogglePublicStatus={onTogglePublicStatus}
            />
          }

          if(searchQuery.trim()) {
            return <div className="text-center py-4 sm:py-6">
              <div>
                <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
                  { path.length == 1 ? `No Repositories found matching "${searchQuery}"` : 
                    `No files or folder found matching "${searchQuery}"`}
                </p>
                <Button variant="outline" onClick={() => onSearchChange('')} className="text-xs sm:text-sm">
                  Clear Search
                </Button>
              </div>
            </div>
          } else {
            return <div className="text-center py-4 sm:py-6">
              <div>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
                  {(() => {
                    const owner = isAdmin ? "You" : user?.name;
                    const isRoot = path.length === 1;
                    return isRoot
                      ? `${owner} haven't created any repository yet`
                      : `${owner} haven't created any files or folders in this directory`;
                  })()}
                </p>
                {path.length == 1 && <Button 
                  className="text-xs sm:text-sm"
                  onClick={onAddRepoClick}
                  disabled={!isAdmin}
                >
                  Create Your Repository
                </Button>}
              </div>
            </div>
          }
        })()}
      </CardContent>
      {path.length === 1 && (
        <CardFooter
          className={`
            border-t px-4 sm:px-6 py-4
            flex justify-center
            ${mode === 1 ? '' : 'shrink-0'}
          `}
        >
          <Button
            variant="outline"
            className="
              w-full max-w-sm
              text-sm font-medium
              transition-all
              hover:bg-primary hover:text-primary-foreground
            "
            onClick={onAddRepoClick}
            disabled={!isAdmin}
          >
            Create New Repository
          </Button>
        </CardFooter>
      )}

      {path.length > 1 && (
        <CardFooter
          className={`
            border-t px-4 sm:px-6 py-4
            flex flex-col sm:flex-row gap-3
            ${mode === 1 ? '' : 'shrink-0'}
          `}
        >
          <Button
            variant="outline"
            className="
              w-full
              text-sm font-medium
              transition-all
              hover:bg-muted
            "
            onClick={onAddFolderClick}
            disabled={!isAdmin}
          >
            Add Folder
          </Button>

          <Button
            variant="outline"
            className="
              w-full
              text-sm font-medium
              transition-all
              hover:bg-primary hover:text-primary-foreground
            "
            onClick={onAddFileClick}
            disabled={!isAdmin}
          >
            Add File
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
