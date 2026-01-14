'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui2/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui2/card'
import { Input } from '@/components/ui2/input'
import { AppDispatch, RootState } from '@/store/store'
import { setForgotLoading3, setForgotStep, setForgotToken } from '@/store/authSlice'
import { HelperService } from '@/module/services/helper_service'

const resetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ForgotPass3() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const pathname = usePathname()

  const authToken = useSelector((state: RootState) => state.auth.forgot_token)
  const isResetting = useSelector((state: RootState) => state.auth.forgot_loading3)
  const step = useSelector((state: RootState) => state.auth.forgot_step)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  
  useEffect(() => {
    dispatch(setForgotLoading3(false))
    if (step != 3) {
      dispatch(setForgotStep(1));
      router.push('/signin')
    }
  }, [pathname, dispatch])

  const handleSubmit = async (formData: ResetPasswordFormData) => {
    dispatch(setForgotLoading3(true))

    try {
      const sanitizedPassword = formData.confirmPassword.trim()

      await axios.post('/api/auth/forgot-pass/set-pass', {
        token: authToken,
        password: sanitizedPassword,
      })

      toast.success('Password changed successfully!')
      dispatch(setForgotToken(""));
      dispatch(setForgotStep(1));
      router.push('/signin')
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

      dispatch(setForgotLoading3(false));
    }
  }

  const clearInputValidationError = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity('')
  }

  const setInputValidationError = (
    event: React.FormEvent<HTMLInputElement>,
    errorMessage: string
  ) => {
    event.currentTarget.setCustomValidity(errorMessage)
  }

  if (isResetting) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center px-4">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your account password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">New Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="******"
                          autoComplete="new-password"
                          required
                          pattern={HelperService.password_regex.source}
                          onInvalid={(event) =>
                            setInputValidationError(event, HelperService.password_format_msg)
                          }
                          onInput={clearInputValidationError}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="******"
                          autoComplete="new-password"
                          required
                          pattern={HelperService.password_regex.source}
                          onInvalid={(event) =>
                            setInputValidationError(event, HelperService.password_format_msg)
                          }
                          onInput={clearInputValidationError}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}