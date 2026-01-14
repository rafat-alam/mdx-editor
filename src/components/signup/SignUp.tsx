'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { toast } from "sonner"
import { GalleryVerticalEnd, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui2/card"
import { Input } from "@/components/ui2/input"
import { Label } from "@/components/ui/label"
import { AppDispatch, RootState } from "@/store/store"
import { setSignUpLoading1, setSignUpStep, setSignUpToken } from "@/store/authSlice"
import { HelperService } from "@/module/services/helper_service"

const EMAIL_PATTERN = HelperService.email_regex.source
const USERNAME_PATTERN = HelperService.username_regex.source
const NAME_PATTERN = HelperService.name_regex.source
const PASSWORD_PATTERN = HelperService.password_regex.source

const EMAIL_ERROR_MESSAGE = HelperService.email_format_msg
const USERNAME_ERROR_MESSAGE = HelperService.username_format_msg
const NAME_ERROR_MESSAGE = HelperService.name_format_msg
const PASSWORD_ERROR_MESSAGE = HelperService.password_format_msg

export function SignUp() {
  const [userEmail, setUserEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [userPassword, setUserPassword] = useState('')
  
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const signup_loading1 = useSelector((state: RootState) => state.auth.signup_loading1)
  const step = useSelector((state: RootState) => state.auth.signup_step)

  useEffect(() => {
    dispatch(setSignUpLoading1(false))
    if (step != 1) {
      dispatch(setSignUpStep(1));
      dispatch(setSignUpToken(""));
    }
  }, [])

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    dispatch(setSignUpToken(""))
    dispatch(setSignUpLoading1(true))

    try {
      const response = await axios.post('/api/auth/signup/send-otp', {
        name: name.trim(),
        email: userEmail.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password: userPassword.trim(),
      })

      dispatch(setSignUpToken(response.data.message))
      toast.success("OTP sent successfully!")
      dispatch(setSignUpStep(2));
      router.push('/signup/verify')
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

      dispatch(setSignUpToken(""))
      dispatch(setSignUpLoading1(false))
    }
  }

  const handleInputValidation = (event: React.FormEvent<HTMLInputElement>) => {
    (event.target as HTMLInputElement).setCustomValidity("")
  }

  const handleInvalidInput = (event: React.FormEvent<HTMLInputElement>, errorMessage: string) => {
    (event.target as HTMLInputElement).setCustomValidity(errorMessage)
  }

  if (signup_loading1) {
    return (
      <div className="bg-background flex w-screen h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-6 md:p-10">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-background flex w-screen h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* eslint-disable @next/next/no-html-link-for-pages */}
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          MDX Editor
        </a>
        {/* eslint-enable @next/next/no-html-link-for-pages */}

        <Card className="bg-background">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Hi, there</CardTitle>
            <CardDescription>
              Register with your Apple or Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    SignUp with Apple
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    SignUp with Google
                  </Button>
                </div>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="user@email.com"
                      required
                      pattern={EMAIL_PATTERN}
                      onInvalid={(e) => handleInvalidInput(e, EMAIL_ERROR_MESSAGE)}
                      onInput={handleInputValidation}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="user123"
                      required
                      pattern={USERNAME_PATTERN}
                      onInvalid={(e) => handleInvalidInput(e, USERNAME_ERROR_MESSAGE)}
                      onInput={handleInputValidation}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="User"
                      required
                      pattern={NAME_PATTERN}
                      onInvalid={(e) => handleInvalidInput(e, NAME_ERROR_MESSAGE)}
                      onInput={handleInputValidation}
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                      pattern={PASSWORD_PATTERN}
                      onInvalid={(e) => handleInvalidInput(e, PASSWORD_ERROR_MESSAGE)}
                      onInput={handleInputValidation}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    SignUp
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Have an account?{" "}
                  <a href="/signin" className="underline underline-offset-4">
                    SignIn
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}