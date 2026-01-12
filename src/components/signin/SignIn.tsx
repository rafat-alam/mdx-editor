'use client'

import { Loader2 } from "lucide-react"
import { SignInForm } from "./SignInForm"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  return (
    <div className="bg-background flex w-screen h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        { (isLoading) ? <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin" />
          : <SignInForm setIsLoading={setIsLoading} /> }
      </div>
    </div>
  )
}
