'use client'
import { SignUpForm } from "@/components/signup-form"
import { setLoading } from "@/store/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { GalleryVerticalEnd, Loader2 } from "lucide-react"
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function SignUpPage() {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setLoading(false));
  }, [pathname])
    
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {!loading ?
        <div className="flex w-full max-w-sm flex-col gap-6">
          {/* eslint-disable @next/next/no-html-link-for-pages */}
          <a href="/" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            MDX Editor
          </a>
          {/* eslint-enable @next/next/no-html-link-for-pages */}
          <SignUpForm />
        </div>  :
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-spin" />
      }
    </div>
  )
}
