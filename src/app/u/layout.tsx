"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UContext } from "./UContext";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserInterface {
  username: string;
  name: string;
  email: null | string;
  last_active: string;
  repo_count: number;
}

interface AxiosResponse {
  status: number;
  data: {
    message: string;
    user: null | UserInterface;
  }
}

export default function ULayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams<{ path: string[] }>();

  const [user, setUser] = useState<UserInterface | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
    
      try {
        const res: AxiosResponse = await axios.get(`/api/u/${params.path[0]}`);

        if(res.status == 200) {
          setUser(res.data.user!);
        } else {
          router.replace('/');
        }
      } catch {
        router.replace('/');
      }
    };
    load();
  }, []);

  return (
    <UContext.Provider value={ user }>
      {children}
    </UContext.Provider>
  );
}
