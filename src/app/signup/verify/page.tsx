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
import { setLoading, setLoading2, setToken } from "@/store/authSlice"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be of 6 digits.",
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
  const token = useSelector((state: RootState) => state.auth.token);
  const loading2 = useSelector((state: RootState) => state.auth.loading2);
  const [isSending, setisSending] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    dispatch(setLoading2(false));
  }, [pathname])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch(setLoading2(true));
    try {
      console.log(token)
      const res = await axios.post('/api/auth/verify-otp', {
        token,
        otp: data.pin,
      });

      toast.success(res?.data?.message || 'Something went wrong!');
      router.push('/signin');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'OTP verification failed');
      dispatch(setLoading2(false));
    }
  }

  const handleResend = async () => {
    setisSending(true);
    try {
      const res = await axios.post('/api/auth/resend-otp', {
        token
      });
      dispatch(setToken(res.data.token));
      toast.success('OTP Resended');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
    setisSending(false);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-6">
        {!loading2 ? <><FormField
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
