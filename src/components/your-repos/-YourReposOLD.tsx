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
  Calendar,
  Loader2,
  Trash2,
  Search,
  Globe,
  Lock,
  User2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { getSession, useSession } from 'next-auth/react';
import { HelperService } from '@/module/services/helper_service';

interface Node {
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: boolean | null;
  last_updated: string;
}

interface User {
  username: string;
  name: string;
  email: string;
  session_id: string;
}

interface Props {
  path: string[];
}

export function YourReposOLD() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [nodes, setNodes] = useState<Node[]>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [isAddRepoDialogOpen, setIsAddRepoDialogOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState("");
  const [disabledSwitch, setDisabledSwitch] = useState("");
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const nameRegex = HelperService.node_name_regex;

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user as User);
    } else if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, session, router]);

  const fetchNodes = async () => {
    setNodes(undefined);
    setIsLoading(true);

    const session = await getSession(); 
    if(!session) { router.push('/'); }

    try {
      const res = await axios.post('/api/edit/get-path', { path: [session?.user.username] });

      if (res.data.list === null) {
        router.replace('/');
      } else {
        setNodes(res.data.list);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (!status) {
        toast.error("Network error!");
        return;
      }

      switch (status) {
        case 400:
          toast.error(error.response?.data?.message ?? "Bad request");
          break;
        case 401:
          router.push("/signin");
          break;
        case 403:
        case 404:
          router.push("/");
          break;
        default:
          router.push("/");
      }
    } else {
      toast.error("Unexpected error occurred!");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const session = await getSession(); 
    if(!session) { router.push('/'); }
    try {
      await axios.post('/api/edit/remove', { 
        path: [session?.user.username, deleteTarget] 
      });
      toast.success("Deleted successfully!");
      await fetchNodes();
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (nodeName: string) => {
    setDeleteTarget(nodeName);
    setIsDeleteDialogOpen(true);
  };

  const handleAddRepo = async () => {
    setIsAddingRepo(true);

    try {
      await axios.post('/api/edit/add-repo', { name: repoName });
      toast.success("Repo added!");
      await fetchNodes();
    } catch (error) {
      handleError(error);
    } finally {
      setIsAddingRepo(false);
      setIsAddRepoDialogOpen(false);
    }
  };

  const openAddRepoDialog = () => {
    setRepoName("");
    setIsAddRepoDialogOpen(true);
  };

  const handleTogglePublicStatus = async (checked: boolean, node: Node) => {
    setNodes(prev =>
      prev?.map(n => 
        n.node_name === node.node_name ? { ...n, is_public: checked } : n
      )
    );

    setDisabledSwitch(node.node_name);

    try {
      await axios.post('/api/edit/set-repo-vis', { 
        name: node.node_name, 
        vis: checked 
      });
    } catch (error) {
      handleError(error);
    } finally {
      setDisabledSwitch("");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const navigateToRepo = (repoName: string) => {
    router.replace(`/u/${user?.username}/${repoName}`, { scroll: false });
  };

  const filteredNodes = nodes?.filter(node =>
    node.node_name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  ).sort((a, b) =>
    a.node_name.localeCompare(b.node_name, undefined, { sensitivity: "base" }
  ));

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (filteredNodes && filteredNodes.length > 0) {
      return (
        <div className="space-y-4">
          {filteredNodes.map((node) => (
            <div 
              key={node.node_name} 
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-3 last:border-0 gap-2 sm:gap-0"
            >
              <div className="max-w-full sm:max-w-[60%]">
                <h3 className="font-medium text-sm sm:text-base truncate">
                  {node.node_name}
                </h3>
                <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-1 sm:gap-0">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(node.last_updated)}</span>
                  </div>
                  <span className="mx-1 sm:mx-2 hidden sm:inline">•</span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    REPO
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-0 justify-between sm:justify-end">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Switch
                    id={`public-toggle-${node.node_name}`}
                    checked={!!node.is_public}
                    onCheckedChange={(checked) => handleTogglePublicStatus(checked, node)}
                    className="scale-75 sm:scale-100"
                    disabled={node.node_name === disabledSwitch}
                  />
                  <Label 
                    htmlFor={`public-toggle-${node.node_name}`} 
                    className="text-xs sm:text-sm cursor-pointer"
                  >
                    {node.is_public ? (
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

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateToRepo(node.node_name)}
                    className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border border-input"
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 sm:h-9 w-7 sm:w-9 p-0 border border-input"
                    onClick={() => openDeleteDialog(node.node_name)}
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

    if (searchQuery.trim()) {
      return (
        <div className="text-center py-4 sm:py-6">
          <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
            No repositories found matching "{searchQuery}"
          </p>
          <Button variant="outline" onClick={() => setSearchQuery('')} className="text-xs sm:text-sm">
            Clear Search
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center py-4 sm:py-6">
        <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
          You haven't created any repository yet
        </p>
        <Button 
          className="text-xs sm:text-sm"
          onClick={openAddRepoDialog}
        >
          Create Your Repository
        </Button>
      </div>
    );
  };

  return (
    <div className="w-screen h-[calc(100vh-4rem)] mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <Card className='w-full h-full flex flex-col bg-background'>
        <CardHeader className="pb-2 p-4 sm:p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                {isLoading 
                  ? "Loading Repos..." 
                  : "Your Repos"
                }
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Search and manage your repositories
              </CardDescription>
            </div>

            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <a
                  href={`/u/${user.username}`}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors hover:bg-muted hover:text-foreground"
                >
                  <User2 size={15} className="opacity-80" />
                  <span className="font-medium">{user.name}</span>
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-3 sm:mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 flex-1 overflow-auto">
          {renderContent()}
        </CardContent>

        <CardFooter className="border-t px-4 sm:px-6 py-4 flex justify-center shrink-0">
          <Button
            variant="outline"
            className="w-full max-w-sm text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={openAddRepoDialog}
          >
            Create New Repository
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">Delete Repository</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this repository? This action cannot be undone.
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
              onClick={handleDelete}
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

      {/* Add Repo Dialog */}
      <Dialog open={isAddRepoDialogOpen} onOpenChange={setIsAddRepoDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">Add Repository</DialogTitle>
            <DialogDescription className="text-sm">
              Create a new repository by entering a name and confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Input
              type="text"
              placeholder="Enter repository name..."
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="text-sm"
            />
            <div className="h-0 text-red-500 text-xs">
              {repoName.length === 0 || nameRegex.test(repoName) 
                ? "" 
                : "Error: Repository name is not in valid format"
              }
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddRepoDialogOpen(false)}
              disabled={isAddingRepo}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddRepo}
              disabled={isAddingRepo || !nameRegex.test(repoName)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {isAddingRepo ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Repository'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
