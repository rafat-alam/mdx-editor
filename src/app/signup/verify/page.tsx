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
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

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
  const token = useSelector((state: RootState) => state.signuptoken.token);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(token)
      await axios.post('/api/auth/verify-otp', {
        token,
        otp: data.pin,
      });

      console.log('Account verified! You can now log in.');
      router.push('/signin');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message || 'OTP verification failed');
    }
  }

  // const handleResend = async () => {
  //   try {
  //     const res = await axios.post('/api/auth/resend-otp', {
  //       token
  //     });
  //     settoken(res.data.token);
  //     console.log('OTP Resended');
  //   } catch (err) {
  //     const error = err as AxiosError<{ message: string }>;
  //     console.log(error.response?.data?.message || 'OTP verification failed');
  //   }
  // };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-6">
        <FormField
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
