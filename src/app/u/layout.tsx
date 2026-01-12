"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { UContext } from "./UContext";

interface UserInterface {
  username: string;
  name: string;
  email: null | string;
  last_active: string;
  repo_count: number;
}

interface UserApiResponse {
  status: number;
  data: {
    message: string;
    user: null | UserInterface;
  };
}

export default function ULayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ path: string[] }>();
  const [user, setUser] = useState<UserInterface | undefined>(undefined);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response: UserApiResponse = await axios.get(`/api/u/${params.path[0]}`);
        setUser(response.data.user!);
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
    };

    loadUser();
  }, [params.path, router]);

  return <UContext.Provider value={user}>{children}</UContext.Provider>;
}
