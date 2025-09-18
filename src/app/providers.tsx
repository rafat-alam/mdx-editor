'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    {children}
    <Toaster />
  </Provider>
}
