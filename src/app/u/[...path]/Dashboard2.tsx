'use client'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUContext } from '../UContext';
import axios from 'axios';
import { toast } from 'sonner';
import { DashboardHeader } from './DashboardHeader';
import { StatsCards } from './StatsCards';
import { QuickActions } from './QuickActions';
import { RepositoriesCard } from './RepositoriesCard';
import { DeleteDialog } from './DeleteDialog';
import { AddFolderDialog } from './AddFolderDialog';
import { AddFileDialog } from './AddFileDialog';
import { AddRepoDialog } from './AddRepoDialog';
import { MDXEditorDialog } from './MDXEditorDialog';
import { SeeProfilesDialog } from './SeeProfilesDialog';

interface _Node {
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: null | boolean;
  last_updated: string;
}

interface Props {
  path: string[];
}

interface AxiosResponse1 {
  status: number;
  data: {
    message: string;
    list: null | _Node[];
  }
}

export function Dashboard({ path }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [node, setNode] = useState<_Node[] | undefined>();
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

      if (res.data.list == null) {
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

      if (path.length == 1 && user && user.repo_count) {
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

      if (user && user.repo_count) {
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

  return (
    <div className={
      mode == 1 
      ? "w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6" 
      : "w-screen h-[calc(100vh-4rem)] mx-auto px-2 sm:px-4 py-4 sm:py-6"}
    >
      {mode == 1 && <>
        <DashboardHeader user={user} />
        <StatsCards user={user} />
        <QuickActions 
          setMDXPath={setMDXPath}
          setIsMDXDialogOpen={setIsMDXDialogOpen}
          setSeeProfilesUsername={setSeeProfilesUsername}
          setIsSeeProfilesDialogOpen={setIsSeeProfilesDialogOpen}
        />
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Repositories</h2>
      </>}
      
      <RepositoriesCard
        mode={mode}
        setMode={setMode}
        path={path}
        user={user}
        pathname={pathname}
        router={router}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        node={node}
        disableSwitch={disableSwitch}
        handleTogglePublicStatus={handleTogglePublicStatus}
        setNextChild={setNextChild}
        _handleDelete={_handleDelete}
        _handleAddRepo={_handleAddRepo}
        _handleAddFolder={_handleAddFolder}
        _handleAddFile={_handleAddFile}
      />

      <DeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />

      <AddFolderDialog
        isAddFolderDialogOpen={isAddFolderDialogOpen}
        setIsAddFolderDialogOpen={setIsAddFolderDialogOpen}
        folderName={folderName}
        setFolderName={setFolderName}
        isAddingFolder={isAddingFolder}
        handleAddFolder={handleAddFolder}
        nameRegex={nameRegex}
      />

      <AddFileDialog
        isAddFileDialogOpen={isAddFileDialogOpen}
        setIsAddFileDialogOpen={setIsAddFileDialogOpen}
        fileName={fileName}
        setFileName={setFileName}
        isAddingFile={isAddingFile}
        handleAddFile={handleAddFile}
        nameRegex={nameRegex}
      />

      <AddRepoDialog
        isAddRepoDialogOpen={isAddRepoDialogOpen}
        setIsAddRepoDialogOpen={setIsAddRepoDialogOpen}
        repoName={repoName}
        setRepoName={setRepoName}
        isAddingRepo={isAddingRepo}
        handleAddRepo={handleAddRepo}
        nameRegex={nameRegex}
      />

      <MDXEditorDialog
        isMDXDialogOpen={isMDXDialogOpen}
        setIsMDXDialogOpen={setIsMDXDialogOpen}
        MDXPath={MDXPath}
        setMDXPath={setMDXPath}
      />

      <SeeProfilesDialog
        isSeeProfilesDialogOpen={isSeeProfilesDialogOpen}
        setIsSeeProfilesDialogOpen={setIsSeeProfilesDialogOpen}
        seeProfilesUsername={seeProfilesUsername}
        setSeeProfilesUsername={setSeeProfilesUsername}
        nameRegex={nameRegex}
      />
    </div>
  );
}
