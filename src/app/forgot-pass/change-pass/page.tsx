'use client'

import { z } from 'zod'
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
import axios, { AxiosError } from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'
import { AppDispatch, RootState } from '@/store/store'
import { useEffect } from 'react'
import { setLoading4, setLoading6 } from '@/store/authSlice'
import { Loader2 } from 'lucide-react'

// 🔹 Inline Zod schema
const formSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function ResetPasswordPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.forgottoken2);
  const loading6 = useSelector((state: RootState) => state.auth.loading6);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setLoading6(false));
  }, [pathname])


  async function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(setLoading6(true));
    try {
      const res = await axios.post('/api/auth/forgot-pass/set-pass', {
        token,
        newPassword: values.confirmPassword,
      });

      toast(res?.data?.message || 'Something went wrong!');
      router.push('/signin');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast(error.response?.data?.message || 'OTP verification failed');
      dispatch(setLoading6(false));
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center px-4">
      {!loading6 ?<Card className="mx-auto max-w-sm bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* New Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
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
      </Card> :
      <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-spin" />}
    </div>
  )
}
