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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui2/dialog";
import {
  FileText,
  BookOpen,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  BookMarked,
  Trash2,
  Search,
  Globe,
  Lock,
  FileCode,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
}

interface Props {
  path : string [];
}

export function Dashboard({ path } : Props) {
  const [user, setUser] = useState<UserInterface | undefined>(
    {
      username: "rafat",
      name: "Rafat Alam",
      email: null,
      last_active: "2026-01-04T10:15:30.456Z",
    }
  );
  const [nodeCount, setNodeCount] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [node, setNode] = useState<_Node [] | undefined>([{
    node_name: "repo",
    node_type: "FOLDER",
    is_public: true,
    last_updated: "2026-01-04T10:15:30.456Z",
  }, {
    node_name: "repo2",
    node_type: "FILE",
    is_public: true,
    last_updated: "2026-01-04T10:15:30.456Z",
  }]);
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    
  }, []);

  const handleConfirmDelete = () => {
    setIsDeleting(true);

    setIsDeleteDialogOpen(false);
    setIsDeleting(false);
  }

  const handleViewCombinedMdx = () => {

  }

  const handleViewFiles = () => {

  }

  const handleTogglePublicStatus = (checked: boolean, repo: _Node) => {
    setNode(prev =>
      prev && prev.map(r => 
        r.node_name === repo.node_name ? { ...r, is_public: checked } : r
      )
    );
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
        {!user && (
          <>Hi, <Skeleton className="ml-2 h-10 sm:h-8 w-16 sm:w-20" /></>
        )}

        {user && user.email && (
          <>Hi, {user.name}</>
        )}

        {user && !user.email && (
          <>{user.name}</>
        )}
      </h1>
      <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
        {!user && (
          <Skeleton className="ml-2 h-7 sm:h-5
           w-72 sm:w-90" />
        )}

        {user && user.email && (
          <>Welcome back, Here&apos;s an overview of your activity.</>
        )}

        {user && !user.email && (
          <>Welcome back, Here&apos;s an overview of {user.name}'s activity.</>
        )}
      </p>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="h-full bg-background">
          <CardHeader className="pb-2 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-medium">Repositories</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your saved Repositories</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="flex items-center">
              <BookMarked className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-3" />
              {!nodeCount ? (
                <Skeleton className="h-8 sm:h-10 w-16 sm:w-20" />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold">{nodeCount}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full bg-background">
          <CardHeader className="pb-2 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-medium">Last Active</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your previous session</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="flex items-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-3" />
              {!user ? (
                <Skeleton className="h-8 sm:h-10 w-16 sm:w-20" />
              ) : (
                <span className="text-base sm:text-lg">
                  {user.last_active ? formatDate(user.last_active) : 'First Session'}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 justify-start">
          <Link href="/editor" className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">MDX Editor</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Create and edit MDX content</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 justify-start">
          <Link href={`../r/`} className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">Your Repos...</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">See your Repositories</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 justify-start">
          <Link href="#" className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">Public Repos...</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">See Public Repositories</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 justify-start">
          <Link href="#" className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">Profile Settings</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your account</span>
          </Link>
        </Button>
      </div>

      {/* Saved Repositories */}
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Repositories</h2>
      <Card className='bg-background'>
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Your Repos...</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Search and manage your repositories and files
          </CardDescription>
          <div className="flex items-center space-x-2 mt-3 sm:mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search in your repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {!node ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : node.length > 0 ? (
            <div className="space-y-4">
              {node.map((repo) => (
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
                    {path.length == 1 && <div className="flex items-center">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Switch
                          id={`public-toggle-${repo.node_name}`}
                          checked={!!repo.is_public}
                          onCheckedChange={(checked: boolean) => handleTogglePublicStatus(checked, repo)}
                          className="scale-75 sm:scale-100"
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewFiles()}
                        className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border border-input"
                        >
                        View
                      </Button>
                      { repo.node_type == 'FILE' && <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewCombinedMdx()}
                        title="View all MDX content combined in one document"
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
                          handleDeleteClick();
                        }}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6">
              {searchQuery.trim() ? (
                <div>
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">No Repositories found matching &quot;{searchQuery}&quot;</p>
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="text-xs sm:text-sm">
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">You haven&apos;t created any Repositories yet</p>
                  <Button asChild className="text-xs sm:text-sm">
                    <Link href="#">Create Your Repository</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {node && node.length > 0 && (
          <CardFooter className="border-t p-4 sm:p-6">
            <Button variant="outline" className="w-full text-xs sm:text-sm" asChild>
              <Link href="/#">Create New Repository</Link>
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">Delete Repository</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this Repository? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}