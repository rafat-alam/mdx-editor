'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

interface AxiosResponse {
  status: number;
  data: {
    message: string;
    list: null | any[];
  }
}

export function useEditorContent(path: string[]) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isContentArrived, setIsContentArrived] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res: AxiosResponse = await axios.post('/api/edit/get-path', { path });

        if (res.data.list == null) {
          setContent(res.data.message);
          setIsContentArrived(true);
        } else {
          router.replace('/');
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

    fetchContent();
  }, [path, router]);

  return { content, isContentArrived };
}
