'use client'
import { GalleryVerticalEnd, Loader2 } from "lucide-react"
import { SignInForm } from "@/components/signin-form"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { usePathname } from "next/navigation";
import { setLoading3 } from "@/store/signUpSlice";

export default function SignInPage() {
  const loading3 = useSelector((state: RootState) => state.signup.loading3);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setLoading3(false));
  }, [pathname])

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {!loading3 ?
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            MDX Editor
          </a>
          <SignInForm />
        </div> : 
      <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-spin" />}
    </div>
  )
}