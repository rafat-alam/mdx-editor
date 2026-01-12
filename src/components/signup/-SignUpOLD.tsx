// 'use client'
// import { SignUpFormOLD } from "@/components/signup/-SignUpFormOLD"
// import { setSignUpLoading1 } from "@/store/authSlice";
// import { AppDispatch, RootState } from "@/store/store";
// import { GalleryVerticalEnd, Loader2 } from "lucide-react"
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";


// export function SignUpOLD() {
//   const signup_loading1 = useSelector((state: RootState) => state.auth.signup_loading1);
//   const dispatch = useDispatch<AppDispatch>()

//   useEffect(() => {
//     dispatch(setSignUpLoading1(false));
//   }, [])

//   return (
//     <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
//       {!signup_loading1 ?
//         <div className="flex w-full max-w-sm flex-col gap-6">
//           {/* eslint-disable @next/next/no-html-link-for-pages */}
//           <a href="/" className="flex items-center gap-2 self-center font-medium">
//             <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
//               <GalleryVerticalEnd className="size-4" />
//             </div>
//             MDX Editor
//           </a>
//           {/* eslint-enable @next/next/no-html-link-for-pages */}
//           <SignUpFormOLD />
//         </div>  :
//         <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-spin" />
//       }
//     </div>
//   )
// }
