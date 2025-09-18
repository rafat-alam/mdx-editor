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
import { useState } from 'react';
import Link from 'next/link';

interface RepoInterface {
  id: string;
  description: string;
  name: string;
  createdAt: string;
  files: number;
  isPublic: boolean;
}

export function YourRepo() {
  const isRepoLoading = false;
  const [searchQuery, setSearchQuery] = useState("");
  const [repos, setRepos] = useState<RepoInterface[]>([{
    id: "1",
    description: "string",
    name: "Repo 1",
    createdAt: "2025-09-18",
    files: 5,
    isPublic: false
  },{
    id: "2",
    description: "string",
    name: "Repo 2",
    createdAt: "2025-09-18",
    files: 5,
    isPublic: false
  },{
    id: "3",
    description: "string",
    name: "Repo 3",
    createdAt: "2025-09-18",
    files: 5,
    isPublic: false
  },{
    id: "4",
    description: "string",
    name: "Repo 4",
    createdAt: "2025-09-18",
    files: 5,
    isPublic: false
  },{
    id: "5",
    description: "string",
    name: "Repo 5",
    createdAt: "2025-09-18",
    files: 5,
    isPublic: false
  }]);

  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsDeleting(true);

    setIsDeleteDialogOpen(false);
    setIsDeleting(false);
  }

  const handleViewCombinedMdx = () => {

  }

  const handleViewFiles = () => {

  }

  const handleTogglePublicStatus = (checked: boolean, repo: RepoInterface) => {
    setRepos(prev =>
      prev.map(r => 
        r.id === repo.id ? { ...r, isPublic: checked } : r
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
          {isRepoLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : repos.length > 0 ? (
            <div className="space-y-4">
              {repos.map((repo) => (
                <div key={repo.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-3 last:border-0 gap-2 sm:gap-0">
                  <div className="max-w-full sm:max-w-[60%]">
                    <h3 className="font-medium text-sm sm:text-base truncate">{repo.name}</h3>
                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-1 sm:gap-0">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(repo.createdAt)}</span>
                      </div>
                      <span className="mx-1 sm:mx-2 hidden sm:inline">•</span>
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                        {repo.files} {repo.files === 1 ? 'file' : 'files'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-0 justify-between sm:justify-end">
                    <div className="flex items-center">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Switch
                          id={`public-toggle-${repo.id}`}
                          checked={!!repo.isPublic}
                          onCheckedChange={(checked: boolean) => handleTogglePublicStatus(checked, repo)}
                          className="scale-75 sm:scale-100"
                        />
                        <Label htmlFor={`public-toggle-${repo.id}`} className="text-xs sm:text-sm cursor-pointer">
                          {repo.isPublic ? (
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
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewFiles()}
                        className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border border-input"
                        >
                        View
                        </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewCombinedMdx()}
                        title="View all MDX content combined in one document"
                        className="hover:bg-primary/10 hover:text-primary h-7 sm:h-9 w-7 sm:w-9 p-0 border border-input"
                      >
                        <FileCode className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
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
        {repos.length > 0 && (
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