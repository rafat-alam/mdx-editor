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
  FileCode,
  Undo2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUContext } from '../UContext';
import axios from 'axios';
import { toast } from 'sonner';

interface _Node {
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: null | boolean;
  last_updated: string;
}

interface Props {
  path : string [];
}

interface AxiosResponse1 {
  status: number;
  data: {
    message: string;
    list: null | _Node [];
  }
}

interface AxiosResponse2 {
  status: number;
  data: {
    message: string;
  }
}

export function Dashboard({ path } : Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [node, setNode] = useState<_Node [] | undefined>();
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const nameRegex = /^[A-Za-z0-9_-]{1,256}$/;
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [isAddRepoDialogOpen, setIsAddRepoDialogOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [nextChild, setNextChild] = useState("");
  const [disableSwitch, setDisableSwitch] = useState("");
  let user = useUContext();

  const handleRefresh = async () => {
    setNode(undefined);
    
    try {
      const res: AxiosResponse1 = await axios.post('/api/edit/get-path', { path });

      if(res.status == 200) {
        if(res.data.list == null) {
          router.replace('/');
        } else {
          setNode(res.data.list);
        }
      } else if(res.status == 400) {
        toast.error(res.data.message);
      } else {
        router.replace('/');
      }
    } catch {
      router.replace('/');
    }
  }

  useEffect(() => {
    handleRefresh();
  }, [pathname]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res: AxiosResponse2 = await axios.post('/api/edit/remove', { path: [...path, nextChild] });

      if(res.status == 200) {
        if(path.length == 1 && user && user.repo_count) {
          user.repo_count--;
        }
        toast.success("Deleted Successfully!")
      } else if(res.status == 400) {
        toast.error(res.data.message);
      } else {
        router.replace('/');
      }
    } catch {
      router.replace('/');
    }
    
    setIsDeleteDialogOpen(false);
    setIsDeleting(false);
    handleRefresh();
  }

  const _handleDelete = () => {
    setIsDeleteDialogOpen(true);
  }

  const handleAddRepo = async () => {
    setIsAddingRepo(true);

    try {
      const res: AxiosResponse2 = await axios.post('/api/edit/add-repo', { name: repoName });

      if(res.status == 200) {
        if(user && user.repo_count) {
          user.repo_count++;
        }
        toast.success("Repo Added!")
      } else if(res.status == 400) {
        toast.error(res.data.message);
      } else {
        router.replace('/');
      }
    } catch {
      router.replace('/');
    }
    
    setIsAddRepoDialogOpen(false);
    setIsAddingRepo(false);
    handleRefresh();
  }

  const _handleAddRepo = () => {
    setRepoName("");
    setIsAddRepoDialogOpen(true);
  }

  const handleAddFolder = async () => {
    setIsAddingFolder(true);

    try {
      const res: AxiosResponse2 = await axios.post('/api/edit/add-folder', { path, name: folderName });

      if(res.status == 200) {
        toast.success("Folder Added!")
      } else if(res.status == 400) {
        toast.error(res.data.message);
      } else {
        router.replace('/');
      }
    } catch {
      router.replace('/');
    }
    
    setIsAddFolderDialogOpen(false);
    setIsAddingFolder(false);
    handleRefresh();
  }

  const _handleAddFolder = () => {
    setFolderName("");
    setIsAddFolderDialogOpen(true);
  }

  const handleAddFile = async () => {
    setIsAddingFile(true);
    
    try {
      const res: AxiosResponse2 = await axios.post('/api/edit/add-file', { path, name: fileName + ".mdx" });

      if(res.status == 200) {
        toast.success("File Added!")
      } else if(res.status == 400) {
        toast.error(res.data.message);
      } else {
        router.replace('/');
      }
    } catch {
      router.replace('/');
    }
    
    setIsAddFileDialogOpen(false);
    setIsAddingFile(false);
    handleRefresh();
  }

  const _handleAddFile = () => {
    setFileName("");
    setIsAddFileDialogOpen(true);
  }

  const handleTogglePublicStatus = async (checked: boolean, repo: _Node) => {
    setNode(prev =>
      prev && prev.map(r => 
        r.node_name === repo.node_name ? { ...r, is_public: checked } : r
      )
    );

    setDisableSwitch(repo.node_name);

    try {
      const res: AxiosResponse2 = await axios.post('/api/edit/set-repo-vis', { name: repo.node_name, vis: checked });

      if(res.status != 200) {
        if(res.status == 400) {
          toast.error(res.data.message);
        } else {
          toast.error(res.data.message);
          router.replace('/');
        }
      }
    } catch {
      router.replace('/');
    }

    setDisableSwitch("");
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
    <div className="w-screen h-[calc(100vh-4rem)] mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <Card className='w-full h-full flex flex-col bg-background'>
        <CardHeader className="pb-2 p-4 sm:p-6 shrink-0">
          <CardTitle className="text-base sm:text-lg">
            {path.length == 1 ?
              (!user ? `Loading Repos...` :
                (!user.email ? `${user?.name}'s Repos...` : `Your Repos...`)) :
            `Inside folder : ${path[path.length - 1]}`}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Search and manage your repositories, files and folder
          </CardDescription>
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
        <CardContent className="p-4 sm:p-6 flex-1 overflow-auto">
          {(() => {
            if(!node || !user) {
              return <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            }

            const filteredItems = node.filter(item =>
              item.node_name.toLowerCase().includes(searchQuery.trim().toLowerCase())
            );

            if(filteredItems.length > 0) {
              return <div className="space-y-4">
                {filteredItems.map((repo) => (
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
                      {path.length == 1 && user.email && <div className="flex items-center">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Switch
                            id={`public-toggle-${repo.node_name}`}
                            checked={!!repo.is_public}
                            onCheckedChange={(checked: boolean) => handleTogglePublicStatus(checked, repo)}
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
                          onClick={() => {
                            const newPath = [...pathname.split("/"), repo.node_name].join("/");
                            router.replace(newPath, { scroll: false });
                          }}
                          className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border border-input"
                          >
                          View
                        </Button> }
                        { repo.node_type == 'FILE' && <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const newPath = [...pathname.split("/"), repo.node_name].filter(Boolean).slice(1).join("/");
                            window.open(`/editor/${newPath}`, "_blank");
                          }}
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
                            setNextChild(repo.node_name);
                            _handleDelete();
                          }}
                          disabled={!user || !user.email}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }

            if(searchQuery.trim()) {
              return <div className="text-center py-4 sm:py-6">
                <div>
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
                    { path.length == 1 ? `No Repositories found matching "${searchQuery}"` : 
                      `No files or folder found matching "${searchQuery}"`}
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="text-xs sm:text-sm">
                    Clear Search
                  </Button>
                </div>
              </div>
            } else {
              return <div className="text-center py-4 sm:py-6">
                <div>
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
                    {(() => {
                      const owner = user.email ? "You" : user.name;
                      const isRoot = path.length === 1;

                      return isRoot
                        ? `${owner} haven't created any repository yet`
                        : `${owner} haven't created any files or folders in this directory`;
                    })()}
                  </p>
                  {path.length == 1 && <Button 
                    className="text-xs sm:text-sm"
                    onClick={() => {_handleAddRepo()}}
                    disabled={!user || !user.email}
                  >
                    Create Your Repository
                  </Button>}
                </div>
              </div>
            }
          })()}
        </CardContent>
        {path.length == 1 && (
          <CardFooter className="border-t p-4 sm:p-6 shrink-0">
            <Button 
              variant="outline"
              className="w-full text-xs sm:text-sm mx-5"
              onClick={() => {_handleAddRepo()}}
              disabled={!user || !user.email}
            >
              Create New Repository
            </Button>
          </CardFooter>
        )}
        {path.length > 1 && (
          <CardFooter className="border-t p-4 sm:p-6 shrink-0">
            <Button
              variant="outline" 
              className="w-full text-xs sm:text-sm mx-5" 
              onClick={() => {_handleAddFolder()}}
              disabled={!user || !user.email}
            >
              Add Folder
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-xs sm:text-sm mx-5" 
              onClick={() => {_handleAddFile()}}
              disabled={!user || !user.email}
            >
              Add File
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

      {/* Add Folder Confirmation Dialog */}
      <Dialog open={isAddFolderDialogOpen} onOpenChange={setIsAddFolderDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">Add Folder</DialogTitle>
            <DialogDescription className="text-sm">
              Create a new folder by entering a name and confirming to add it to the current location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Input
              type="text"
              placeholder="Enter Folder name..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="text-sm"
            />
            <div className='h-0 text-red-500 text-xs'>
              {folderName.length == 0 || nameRegex.test(folderName) ? ``: `Error : Folder name is not in format`}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddFolderDialogOpen(false)}
              disabled={isAddingFolder}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddFolder}
              disabled={isAddingFolder || !nameRegex.test(folderName)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {isAddingFolder ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Folder'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add File Confirmation Dialog */}
      <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">Add File</DialogTitle>
            <DialogDescription className="text-sm">
              Create a new file by entering a name and confirming to add it to the current location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="pr-10 text-sm"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                .mdx
              </span>
            </div>

            <div className="h-0 text-red-500 text-xs">
              {fileName.length === 0 || nameRegex.test(fileName)
                ? ""
                : "Error: File name is not in valid format"}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddFileDialogOpen(false)}
              disabled={isAddingFile}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddFile}
              disabled={isAddingFile || !nameRegex.test(fileName)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {isAddingFile ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add File'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Repo Confirmation Dialog */}
      <Dialog open={isAddRepoDialogOpen} onOpenChange={setIsAddRepoDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">Add Repo</DialogTitle>
            <DialogDescription className="text-sm">
              Create a new repo by entering a name and confirming to add it to the current location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Input
              type="text"
              placeholder="Enter Repo name..."
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="text-sm"
            />
            <div className='h-0 text-red-500 text-xs'>
              {repoName.length == 0 || nameRegex.test(repoName) ? ``: `Error : Repo name is not in format`}
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
                'Add Repo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}