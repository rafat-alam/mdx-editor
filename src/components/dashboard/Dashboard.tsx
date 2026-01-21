'use client'

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { useUContext } from '../../app/u/UContext';
import { DashboardHeader } from './DashboardHeader';
import { StatsOverview } from './StatsOverview';
import { QuickActions } from './QuickActions';
import { RepositoriesCard } from './RepositoriesCard';
import { DeleteDialog } from './DeleteDialog';
import { AddFolderDialog } from './AddFolderDialog';
import { AddFileDialog } from './AddFileDialog';
import { AddRepoDialog } from './AddRepoDialog';
import { MDXEditorDialog } from './MDXEditorDialog';
import { SeeProfilesDialog } from './SeeProfilesDialog';
import { HelperService } from '@/module/services/helper_service';
import { RenameDialog } from './RenameDialog';

interface _Node {
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: null | boolean;
  last_updated: string;
}

interface Props {
  path: string[];
  m: number;
}

interface AxiosResponse1 {
  status: number;
  data: {
    message: string;
    list: null | _Node[];
  }
}

interface UserInterface {
  username: string;
  name: string;
  email: null | string;
  last_active: string;
  repo_count: number;
}

export function Dashboard({ path, m }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [node, setNode] = useState<_Node[] | undefined>();
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const nameRegex = HelperService.node_name_regex;
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [rename, setRename] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [isAddRepoDialogOpen, setIsAddRepoDialogOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [nextChild, setNextChild] = useState("");
  const [disableSwitch, setDisableSwitch] = useState("");
  let user: UserInterface | undefined = useUContext();
  const [isMDXDialogOpen, setIsMDXDialogOpen] = useState(false);
  const [MDXPath, setMDXPath] = useState("");
  const [isSeeProfilesDialogOpen, setIsSeeProfilesDialogOpen] = useState(false);
  const [seeProfilesUsername, setSeeProfilesUsername] = useState("");
  const [mode, setMode] = useState((path.length > 1) || (m == 1) ? 0 : 1);
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isContentArrived, setIsContentArrived] = useState(false);
  const [isUserArrived, setIsUserArrived] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isContentArrived && isUserArrived && user) {
      setLoadingContent(false);
    } else {
      setLoadingContent(true);
    }
  }, [isContentArrived, isUserArrived, user]);

  useEffect(() => {
    if (isUserArrived && user) {
      setLoadingUser(false);
    } else {
      setLoadingUser(true);
    }
  }, [isUserArrived, user]);

  useEffect(() => {
    if (status != "loading") {
      if (status == "authenticated" && session.user.username == path[0]) {
        setIsAdmin(true);
      }
      if (status == "unauthenticated" || session?.user.username != path[0]) {
        setIsAdmin(false);
      }
      setIsUserArrived(true);
    }
  }, [status, session]);

  const handleRefresh = async () => {
    setNode(undefined);
    setIsContentArrived(false);
    
    try {
      const res: AxiosResponse1 = await axios.post('/api/get/path', { path });

      if(res.data.list == null) {
        router.replace('/');
      } else {
        setIsContentArrived(true);
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

  const handleRename = async () => {
    setIsRenaming(true);

    try {
      await axios.post('/api/edit/rename', { path: [...path, nextChild], name: rename});

      toast.success("Rename Successful!")
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
    
    setIsRenameDialogOpen(false);
    setIsRenaming(false);
    handleRefresh();
  }

  const handleRenameClick = () => {
    setIsRenameDialogOpen(true);
  }

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

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  }

  const handleAddRepo = async () => {
    setIsAddingRepo(true);

    try {
      await axios.post('/api/edit/add-repo', { name: repoName });

      if(user) user.repo_count++;
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

  const handleAddRepoClick = () => {
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

  const handleAddFolderClick = () => {
    setFolderName("");
    setIsAddFolderDialogOpen(true);
  }

  const handleAddFile = async () => {
    setIsAddingFile(true);
    
    try {
      await axios.post('/api/edit/add-file', { path, name: fileName });
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

  const handleAddFileClick = () => {
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

  return (
    <div className={
      mode == 1 
      ? "w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6" 
      : "w-screen h-[calc(100vh-4rem)] mx-auto px-2 sm:px-4 py-4 sm:py-6"}
    >
      {mode == 1 && <>
        <DashboardHeader 
          loadingUser={loadingUser}
          isAdmin={isAdmin}
          user={user}
        />

        <StatsOverview 
          loadingUser={loadingUser}
          isAdmin={isAdmin}
          user={user}
        />

        <QuickActions 
          onMDXEditorClick={() => {
            setMDXPath("");
            setIsMDXDialogOpen(true)
          }}
          onSeeProfilesClick={() => {
            setSeeProfilesUsername("")
            setIsSeeProfilesDialogOpen(true)
          }}
        />

        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Repositories</h2>
      </>}

      <RepositoriesCard
        path={path}
        mode={mode}
        searchQuery={searchQuery}
        node={node}
        loadingContent={loadingContent}
        loadingUser={loadingUser}
        isAdmin={isAdmin}
        user={user}
        disableSwitch={disableSwitch}
        pathname={pathname}
        onModeToggle={() => setMode(1 - mode)}
        onSearchChange={setSearchQuery}
        onBackClick={() => {
          if(path.length == 2 && m == 2) {
            router.replace('/public-repos');
          } else {
            const newPath = pathname.split("/").slice(0, -1).join("/");
            router.replace(`${newPath}?m=${m}`, { scroll: false });
          }
        }}
        onRenameClick={(nodeName: string) => {
          setNextChild(nodeName);
          handleRenameClick();
        }}
        onFolderClick={(folderName: string) => {
          const newPath = [...pathname.split("/"), folderName].join("/");
          if(m == 0) {
            router.replace(`${newPath}?m=1`, { scroll: false });
          } else {
            router.replace(`${newPath}?m=${m}`, { scroll: false });
          }
        }}
        onFileClick={(fileName: string) => {
          const newPath = [...pathname.split("/"), fileName].filter(Boolean).slice(1).join("/");
          window.open(`/editor/${newPath}`, "_blank");
        }}
        onDeleteClick={(nodeName: string) => {
          setNextChild(nodeName);
          handleDeleteClick();
        }}
        onTogglePublicStatus={handleTogglePublicStatus}
        onAddRepoClick={handleAddRepoClick}
        onAddFolderClick={handleAddFolderClick}
        onAddFileClick={handleAddFileClick}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <RenameDialog
        isOpen={isRenameDialogOpen}
        isRenaming={isRenaming}
        rename={rename}
        nameRegex={nameRegex}
        onOpenChange={setIsRenameDialogOpen}
        onRenameChange={setRename}
        onConfirm={handleRename}
      />

      <AddFolderDialog
        isOpen={isAddFolderDialogOpen}
        isAdding={isAddingFolder}
        folderName={folderName}
        nameRegex={nameRegex}
        onOpenChange={setIsAddFolderDialogOpen}
        onFolderNameChange={setFolderName}
        onConfirm={handleAddFolder}
      />

      <AddFileDialog
        isOpen={isAddFileDialogOpen}
        isAdding={isAddingFile}
        fileName={fileName}
        nameRegex={nameRegex}
        onOpenChange={setIsAddFileDialogOpen}
        onFileNameChange={setFileName}
        onConfirm={handleAddFile}
      />

      <AddRepoDialog
        isOpen={isAddRepoDialogOpen}
        isAdding={isAddingRepo}
        repoName={repoName}
        nameRegex={nameRegex}
        onOpenChange={setIsAddRepoDialogOpen}
        onRepoNameChange={setRepoName}
        onConfirm={handleAddRepo}
      />

      <MDXEditorDialog
        isOpen={isMDXDialogOpen}
        mdxPath={MDXPath}
        onOpenChange={setIsMDXDialogOpen}
        onPathChange={setMDXPath}
        onOpen={() => {
          window.open(`/editor/${MDXPath}`, "_blank");
        }}
      />

      <SeeProfilesDialog
        isOpen={isSeeProfilesDialogOpen}
        username={seeProfilesUsername}
        nameRegex={nameRegex}
        onOpenChange={setIsSeeProfilesDialogOpen}
        onUsernameChange={setSeeProfilesUsername}
        onOpen={() => {
          window.open(`/u/${seeProfilesUsername}`, "_blank");
          setIsSeeProfilesDialogOpen(false);
        }}
      />
    </div>
  );
}
