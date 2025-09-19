"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { usePathname, useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { setForgotToken2, setLoading, setLoading2, setLoading5, setToken } from "@/store/authSlice"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export default function InputOTPForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.auth.forgottoken);
  const loading5 = useSelector((state: RootState) => state.auth.loading5);
  const [isSending, setisSending] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    dispatch(setLoading5(false));
  }, [pathname])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch(setLoading5(true));
    try {
      const res = await axios.post('/api/auth/forgot-pass/verify-otp', {
        token,
        otp: data.pin,
      });

      dispatch(setForgotToken2(res.data.token));
      toast.success(res?.data?.message || 'Something went wrong!');
      router.push('/forgot-pass/change-pass');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Something went wrong!');
      dispatch(setLoading5(false));
    }
  }

  const handleResend = async () => {
    setisSending(true);
    try {
      const res = await axios.post('/api/auth/forgot-pass/resend-otp', {
        token
      });
      dispatch(setForgotToken2(res.data.token));
      toast.success(res?.data?.message || 'Something went wrong!');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
    setisSending(false);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-6">
        {!loading5 ? <><FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your E-Mail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-5">
          <Button
            type="button"
            variant="destructive"
            onClick={handleResend}
            disabled={isSending}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isSending ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend OTP'
            )}
          </Button>
          <Button type="submit">Submit</Button>
        </div></> :
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-spin" />}
      </form>
    </Form>
  )
}
