"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
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
import { AppDispatch, RootState } from "@/store/store"
import { setSignUpLoading2, setSignUpStep, setSignUpToken } from "@/store/authSlice"

const OTP_LENGTH = 6

const otpFormSchema = z.object({
  pin: z.string().length(OTP_LENGTH, {
    message: `Your one-time password must be ${OTP_LENGTH} digits.`,
  }),
})

type OtpFormValues = z.infer<typeof otpFormSchema>

export function SignUpVerify() {
  const [isResendingOtp, setIsResendingOtp] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const signup_token = useSelector((state: RootState) => state.auth.signup_token)
  const signup_loading2 = useSelector((state: RootState) => state.auth.signup_loading2)
  const step = useSelector((state: RootState) => state.auth.signup_step)

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      pin: "",
    },
  })

  useEffect(() => {
    dispatch(setSignUpLoading2(false))
    if (step != 2) {
      dispatch(setSignUpStep(1));
      router.push('/signup')
    }
  }, [])

  const handleOtpSubmit = async (formData: OtpFormValues) => {
    dispatch(setSignUpLoading2(true))

    try {
      await axios.post('/api/auth/signup/verify-otp', {
        token: signup_token,
        otp: formData.pin,
      })

      toast.success("Account created successfully!")
      dispatch(setSignUpToken(""))
      dispatch(setSignUpStep(1));
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
      
      dispatch(setSignUpLoading2(false))
    }
  }

  const handleResendOtp = async () => {
    setIsResendingOtp(true)

    try {
      const response = await axios.post('/api/auth/signup/resend-otp', {
        token: signup_token
      })

      dispatch(setSignUpToken(response.data.message))
      toast.success('OTP sent successfully!')
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
      setIsResendingOtp(false)
    }
  }

  if (signup_loading2) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin" />
      </div>
    )
  }

  return (
    <Form {...otpForm}>
      <form 
        onSubmit={otpForm.handleSubmit(handleOtpSubmit)} 
        className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-6"
      >
        <FormField
          control={otpForm.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={OTP_LENGTH} {...field}>
                  <InputOTPGroup>
                    {Array.from({ length: OTP_LENGTH }, (_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
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
            onClick={handleResendOtp}
            disabled={isResendingOtp}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isResendingOtp ? (
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