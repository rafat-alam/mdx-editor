"use client";

import { createContext, useContext } from "react";

interface UserInterface {
  username: string;
  name: string;
  email: null | string;
  last_active: string;
  repo_count: number;
}

export const UContext = createContext<UserInterface | undefined>(undefined);

export function useUContext() {
  return useContext(UContext);
}
