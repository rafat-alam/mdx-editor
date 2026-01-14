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
import { setForgotLoading1, setForgotStep, setForgotToken } from '@/store/authSlice'
import { RootState } from '@/store/store'
import { HelperService } from '@/module/services/helper_service'

const emailValidationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

type EmailFormData = z.infer<typeof emailValidationSchema>

export function ForgotPass1() {
  const router = useRouter()
  const dispatch = useDispatch()
  const pathname = usePathname()
  const isLoading = useSelector((state: RootState) => state.auth.forgot_loading1)
  const step = useSelector((state: RootState) => state.auth.forgot_step)

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailValidationSchema),
    defaultValues: {
      email: '',
    },
  })

  useEffect(() => {
    dispatch(setForgotLoading1(false))
    if (step != 1) {
      dispatch(setForgotStep(1));
      router.push('/signin')
    }
  }, [pathname, dispatch])

  const handleSubmit = async (formData: EmailFormData) => {
    dispatch(setForgotLoading1(true))

    try {
      const normalizedEmail = formData.email.trim().toLowerCase()
      
      const response = await axios.post('/api/auth/forgot-pass/send-otp', {
        email: normalizedEmail,
      })

      dispatch(setForgotToken(response.data.message))
      toast('OTP sent successfully!')
      dispatch(setForgotStep(2));
      router.push('/forgot-pass/verify')
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

      dispatch(setForgotLoading1(false));
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

  if (isLoading) {
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
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive an OTP for verification.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="johndoe@mail.com"
                          autoComplete="email"
                          pattern={HelperService.email_regex.source}
                          onInvalid={(event) =>
                            setInputValidationError(event, HelperService.email_format_msg)
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
                  Send OTP
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}