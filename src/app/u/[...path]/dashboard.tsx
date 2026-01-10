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
  Undo2,
  Minimize2,
  Maximize2,
  HouseIcon,
  User2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  const [isMDXDialogOpen, setIsMDXDialogOpen] = useState(false);
  const [MDXPath, setMDXPath] = useState("");
  const [isSeeProfilesDialogOpen, setIsSeeProfilesDialogOpen] = useState(false);
  const [seeProfilesUsername, setSeeProfilesUsername] = useState("");
  const [mode, setMode] = useState(path.length > 1 ? 0 : 1);

  const handleRefresh = async () => {
    setNode(undefined);
    
    try {
      const res: AxiosResponse1 = await axios.post('/api/edit/get-path', { path });

      if(res.data.list == null) {
        router.replace('/');
      } else {
        setNode(res.data.list);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
    }
  }

  useEffect(() => {
    handleRefresh();
  }, [pathname]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await axios.post('/api/edit/remove', { path: [...path, nextChild] });

      if(path.length == 1 && user && user.repo_count) {
        user.repo_count--;
      }
      toast.success("Deleted Successfully!")
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
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
      await axios.post('/api/edit/add-repo', { name: repoName });

      if(user && user.repo_count) {
        user.repo_count++;
      }
      toast.success("Repo Added!")
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
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
      await axios.post('/api/edit/add-folder', { path, name: folderName });
      toast.success("Folder Added!")
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
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
      await axios.post('/api/edit/add-file', { path, name: fileName + ".mdx" });
      toast.success("File Added!")
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
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
      await axios.post('/api/edit/set-repo-vis', { name: repo.node_name, vis: checked });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
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
    <div className= {
      mode == 1 
      ? "w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6" 
      : "w-screen h-[calc(100vh-4rem)] mx-auto px-2 sm:px-4 py-4 sm:py-6"}
    >
      { mode == 1 && <>

        {/* Heading */}
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
        <div className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
          {!user && (
            <Skeleton className="h-8 sm:h-6 w-72 sm:w-90" />
          )}
          {user && user.email && (
            <>Welcome back, Here&apos;s an overview of your activity.</>
          )}
          {user && !user.email && (
            <>Welcome back, Here&apos;s an overview of {user.name}'s activity.</>
          )}
        </div>

      {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">

          {/* Card No of Repositoties */}
          <Card className="h-full bg-background">
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-medium">
                Repositories
              </CardTitle>
              {!user && (
                <div className="text-xs sm:text-sm">
                  <Skeleton className="h-7 sm:h-5 w-72 sm:w-90" />
                </div>
              )}
              {user && user.email && (
                <CardDescription className="text-xs sm:text-sm">
                  Your saved Repositories
                </CardDescription>
              )}
              {user && !user.email && (
                <CardDescription className="text-xs sm:text-sm">
                  {user.name}'s saved Repositories
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="flex items-center">
                <BookMarked className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-3" />
                {!user ? (
                  <Skeleton className="h-7 sm:h-9 w-16 sm:w-20" />
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold">{user.repo_count}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card Last Active */}
          <Card className="h-full bg-background">
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-medium">
                Last Active
              </CardTitle>
              {!user && (
                <div className="text-xs sm:text-sm">
                  <Skeleton className="h-7 sm:h-5 w-72 sm:w-90" />
                </div>
              )}
              {user && user.email && (
                <CardDescription className="text-xs sm:text-sm">
                  Your previous session
                </CardDescription>
              )}
              {user && !user.email && (
                <CardDescription className="text-xs sm:text-sm">
                  {user.name}'s previous session
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="flex items-center">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-3" />
                {!user ? (
                  <Skeleton className="h-7 sm:h-9 w-16 sm:w-20" />
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
          <Button
            asChild 
            variant="outline" 
            className="h-auto py-4 sm:py-6 justify-start"
            onClick={() => {
              setMDXPath("");
              setIsMDXDialogOpen(true)
            }}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center w-full">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="font-medium text-sm sm:text-base">MDX Editor</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground mt-1">AI-powered MDX Editing</span>
            </div>
          </Button>

          <Button 
            asChild 
            variant="outline" 
            className="h-auto py-4 sm:py-6 justify-start"
            onClick={() => {
              setSeeProfilesUsername("")
              setIsSeeProfilesDialogOpen(true)
            }}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center w-full">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="font-medium text-sm sm:text-base">See Profiles...</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground mt-1">Search by username.</span>
            </div>
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
      </> }
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
              { repoName.length == 0 || nameRegex.test(repoName) 
                ? ``
                : `Error : Repo name is not in format`}
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

      {/* MDX Editor Dialog */}
      <Dialog open={isMDXDialogOpen} onOpenChange={setIsMDXDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">MDX Editor</DialogTitle>
            <DialogDescription className="text-sm">
              Enter a file path to open, edit, and enhance your MDX document using the AI-powered MDX Editor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Input
              type="text"
              placeholder="e.g. rafat/repo/file.mdx"
              value={MDXPath}
              onChange={(e) => setMDXPath(e.target.value)}
              className="text-sm"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsMDXDialogOpen(false)}
              disabled={false}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                window.open(`/editor/${MDXPath}`, "_blank");
              }}
              disabled={false}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Open
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* See Profiles... Dialog */}
      <Dialog open={isSeeProfilesDialogOpen} onOpenChange={setIsSeeProfilesDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg">See Profiles...</DialogTitle>
            <DialogDescription className="text-sm">
              Discover public profiles by entering a handle or username.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Input
              type="text"
              placeholder="Enter username"
              value={seeProfilesUsername}
              onChange={(e) => setSeeProfilesUsername(e.target.value)}
              className="pr-10 text-sm"
            />
            <div className="h-0 text-red-500 text-xs">
              {seeProfilesUsername.length === 0 || nameRegex.test(seeProfilesUsername)
                ? ""
                : "Error: Username is not in valid format"}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSeeProfilesDialogOpen(false)}
              disabled={false}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                window.open(`/u/${seeProfilesUsername}`, "_blank");
                setIsSeeProfilesDialogOpen(false);
              }}
              disabled={false}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Open
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}