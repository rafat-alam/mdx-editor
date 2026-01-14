'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { AppDispatch, RootState } from '@/store/store'
import { setForgotLoading2, setForgotStep, setForgotToken } from '@/store/authSlice'

const OTP_LENGTH = 6

const otpValidationSchema = z.object({
  pin: z.string().min(OTP_LENGTH, {
    message: `Your one-time password must be ${OTP_LENGTH} characters.`,
  }),
})

type OTPFormData = z.infer<typeof otpValidationSchema>

export function ForgotPass2() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const pathname = usePathname()
  
  const authToken = useSelector((state: RootState) => state.auth.forgot_token)
  const isVerifying = useSelector((state: RootState) => state.auth.forgot_loading2)
  const [isResending, setIsResending] = useState(false)
  const step = useSelector((state: RootState) => state.auth.forgot_step)

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpValidationSchema),
    defaultValues: {
      pin: '',
    },
  })

  useEffect(() => {
    dispatch(setForgotLoading2(false))
    if (step != 2) {
      dispatch(setForgotStep(1));
      router.push('/signin')
    }
  }, [pathname, dispatch])

  const handleSubmit = async (formData: OTPFormData) => {
    dispatch(setForgotLoading2(true))

    try {
      const response = await axios.post('/api/auth/forgot-pass/verify-otp', {
        token: authToken,
        otp: formData.pin,
      })

      dispatch(setForgotToken(response.data.message))
      toast.success('OTP verified successfully!')
      dispatch(setForgotToken(""));
      dispatch(setForgotStep(3));
      router.push('/forgot-pass/change-pass')
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

      dispatch(setForgotLoading2(false));
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)

    try {
      const response = await axios.post('/api/auth/forgot-pass/resend-otp', {
        token: authToken,
      })

      dispatch(setForgotToken(response.data.message))
      toast.success('OTP resent successfully!')
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
    } finally {
      setIsResending(false)
    }
  }

  const renderOTPSlots = () => {
    return Array.from({ length: OTP_LENGTH }, (_, index) => (
      <InputOTPSlot key={index} index={index} />
    ))
  }

  if (isVerifying) {
    return (
      <Form {...form}>
        <form className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-6">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin" />
        </form>
      </Form>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={OTP_LENGTH} {...field}>
                  <InputOTPGroup>{renderOTPSlots()}</InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-5">
          <Button
            type="button"
            variant="destructive"
            onClick={handleResendOTP}
            disabled={isResending}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend OTP'
            )}
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}