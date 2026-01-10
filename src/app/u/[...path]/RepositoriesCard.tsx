'use client'
import { Input } from '@/components/ui2/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui2/card';
import { Button } from '@/components/ui2/button';
import { Search, Undo2, Minimize2, Maximize2, User2 } from 'lucide-react';
import Link from 'next/link';
import { RepositoryList } from './RepositoryList';

interface _Node {
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: null | boolean;
  last_updated: string;
}

interface User {
  name?: string;
  email?: string | null;
  repo_count?: number;
  last_active?: string | null;
}

interface Props {
  mode: number;
  setMode: (mode: number) => void;
  path: string[];
  user: User | null | undefined;
  pathname: string;
  router: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  node: _Node[] | undefined;
  disableSwitch: string;
  handleTogglePublicStatus: (checked: boolean, repo: _Node) => void;
  setNextChild: (child: string) => void;
  _handleDelete: () => void;
  _handleAddRepo: () => void;
  _handleAddFolder: () => void;
  _handleAddFile: () => void;
}

export function RepositoriesCard({
  mode,
  setMode,
  path,
  user,
  pathname,
  router,
  searchQuery,
  setSearchQuery,
  node,
  disableSwitch,
  handleTogglePublicStatus,
  setNextChild,
  _handleDelete,
  _handleAddRepo,
  _handleAddFolder,
  _handleAddFile,
}: Props) {
  return (
    <Card className={mode == 1 ? 'bg-background' : 'w-full h-full flex flex-col bg-background'}>
      <CardHeader className={mode == 1 ? "pb-2 p-4 sm:p-6" : 'pb-2 p-4 sm:p-6 shrink-0'}>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className="text-base sm:text-lg">
              {path.length == 1 ?
                (!user ? `Loading Repos...` :
                  (!user.email ? `${user?.name}'s Repos...` : `Your Repos...`)) :
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
              onClick={() => {
                setMode(1 - mode);
              }}
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
                  {user ? user.name : "Loading…"}
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
              onClick={() => {
                const newPath = pathname.split("/").slice(0, -1).join("/");
                router.replace(newPath, { scroll: false });
              }}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className={mode == 1 ? "p-4 sm:p-6" : "p-4 sm:p-6 flex-1 overflow-auto"}>
        <RepositoryList
          node={node}
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          path={path}
          pathname={pathname}
          router={router}
          disableSwitch={disableSwitch}
          handleTogglePublicStatus={handleTogglePublicStatus}
          setNextChild={setNextChild}
          _handleDelete={_handleDelete}
          _handleAddRepo={_handleAddRepo}
        />
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
            onClick={_handleAddRepo}
            disabled={!user || !user.email}
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
            onClick={_handleAddFolder}
            disabled={!user || !user.email}
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
            onClick={_handleAddFile}
            disabled={!user || !user.email}
          >
            Add File
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
