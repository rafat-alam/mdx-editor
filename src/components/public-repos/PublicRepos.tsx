'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { EmptyState } from './EmptyState';
import { PublicReposSkeleton } from './PublicReposSkeleton';
import { RepoList } from './RepoList';
import { PublicReposCard } from './PublicReposCard';

interface Node {
  owner_username: string;
  node_name: string;
  last_updated: string;
}

interface AxiosResponse1 {
  status: number;
  data: {
    message: string;
    list: null | Node[];
  }
}

export function PublicRepos() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [nodes, setNodes] = useState<Node[] | undefined>();

  const handleRefresh = async () => {
    setNodes(undefined);
    
    try {
      const res: AxiosResponse1 = await axios.get('/api/edit/get-all-public-repo');

      if (res.data.list == null) {
        router.replace('/');
      } else {
        setNodes(res.data.list);
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
  }, []);

  const filteredNodes = nodes?.filter(item =>
    (item.owner_username + '/' + item.node_name).toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const renderContent = () => {
    if (!nodes) {
      return <PublicReposSkeleton />;
    }

    if (filteredNodes && filteredNodes.length > 0) {
      return <RepoList repos={filteredNodes} onNavigate={(path) => router.replace(path, { scroll: false })} />;
    }

    return <EmptyState searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />;
  };

  return (
    <div className="w-screen h-[calc(100vh-4rem)] mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <PublicReposCard
        isLoading={!nodes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        {renderContent()}
      </PublicReposCard>
    </div>
  );
}
