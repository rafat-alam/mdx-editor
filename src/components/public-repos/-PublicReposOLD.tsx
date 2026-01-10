'use client'
import { Input } from '@/components/ui2/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui2/card';
import { Button } from '@/components/ui2/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

interface _Node {
  owner_username: string;
  node_name: string;
  last_updated: string;
}

interface AxiosResponse1 {
  status: number;
  data: {
    message: string;
    list: null | _Node [];
  }
}

export function PublicReposOLD() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [node, setNode] = useState<_Node [] | undefined>();

  const handleRefresh = async () => {
    setNode(undefined);
    
    try {
      const res: AxiosResponse1 = await axios.get('/api/edit/get-all-public-repo');

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
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className= {"w-screen h-[calc(100vh-4rem)] mx-auto px-2 sm:px-4 py-4 sm:py-6"}>
      <Card className={'w-full h-full flex flex-col bg-background'}>
        <CardHeader className={'pb-2 p-4 sm:p-6 shrink-0'}>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className="text-base sm:text-lg">
                {!node ? `Loading Repos...` : `Public Repos...`}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Search and manage your repositories, files and folder
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3 sm:mt-4">
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
        <CardContent className={"p-4 sm:p-6 flex-1 overflow-auto"}>
          {(() => {
            if(!node) {
              return <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            }

            const filteredItems = node.filter(item =>
              (item.owner_username + '/' + item.node_name).toLowerCase().includes(searchQuery.trim().toLowerCase())
            );

            if(filteredItems.length > 0) {
              return <div className="space-y-4">
                {filteredItems.map((repo) => (
                  <div key={repo.node_name} className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-3 last:border-0 gap-2 sm:gap-0">
                    <div className="max-w-full sm:max-w-[60%]">
                      <h3 className="font-medium text-sm sm:text-base truncate">{`${repo.owner_username}/${repo.node_name}`}</h3>
                      <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-1 sm:gap-0">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(repo.last_updated)}</span>
                        </div>
                        <span className="mx-1 sm:mx-2 hidden sm:inline">•</span>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          REPO
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-0 justify-between sm:justify-end">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            router.replace(`u/${repo.owner_username}/${repo.node_name}`, { scroll: false });
                          }}
                          className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border border-input"
                          >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            } else {
              return <div className="text-center py-4 sm:py-6">
                <div>
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">
                    {`No Repositories found matching "${searchQuery}"`}
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="text-xs sm:text-sm">
                    Clear Search
                  </Button>
                </div>
              </div>
            } 
          })()}
        </CardContent>
      </Card>
    </div>
  );
}