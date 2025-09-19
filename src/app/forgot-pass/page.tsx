'use client'

import { email, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import { usePathname, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setForgotToken, setLoading4 } from '@/store/authSlice'
import { RootState } from '@/store/store'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

// Inline schema for email validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

export default function ForgetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const router = useRouter();
  const dispatch = useDispatch();
  const loading4 = useSelector((state: RootState) => state.auth.loading4);
  const pathname = usePathname();

  useEffect(() => {
    dispatch(setLoading4(false));
  }, [pathname])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(setLoading4(true));
    try {
      const res = await axios.post('/api/auth/forgot-pass/send-otp', {
        email: values.email,
      });

      dispatch(setForgotToken(res.data.token));
      toast(res?.data?.message || 'Something went wrong!');
      router.push('/forgot-pass/verify');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast(error.response?.data?.message || 'OTP verification failed');
      dispatch(setLoading4(false));
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center px-4">
      {!loading4 ? <Card className="mx-auto max-w-sm bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive OTP for verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
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
      </Card> :
      <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-spin" />}
    </div>
  )
}
