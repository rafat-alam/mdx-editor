'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useEditorAuth(path: string[]) {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUserArrived, setIsUserArrived] = useState(false);

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
  }, [status, session, path]);

  return { isAdmin, isUserArrived };
}
