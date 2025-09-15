'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [token, settoken] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', {
        email,
        username,
        password,
      });

      console.log('OTP sent to your email');
      settoken(res.data.token);
      setStep('verify');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/verify-otp', {
        token,
        otp,
      });

      console.log('Account verified! You can now log in.');
      router.push('/signin');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post('/api/auth/resend-otp', {
        token
      });
      settoken(res.data.token);
      console.log('OTP Resended');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <form
      onSubmit={step === 'signup' ? handleSignup : handleVerify}
      className="p-4 max-w-md mx-auto"
    >
      <h2 className="text-xl mb-4">{step === 'signup' ? 'Sign Up' : 'Verify OTP'}</h2>

      {step === 'signup' ? (
        <>
          <input
            className="border p-2 w-full mb-2"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            className="border p-2 w-full mb-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            className="border p-2 w-full mb-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="bg-green-600 text-white p-2 w-full">
            Sign Up
          </button>
        </>
      ) : (
        <>
          <input
            className="border p-2 w-full mb-2"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />

          <button className="bg-green-600 text-white p-2 w-full" onClick={handleResend}>
            Resend OTP
          </button>
          <br />
          <button type="submit" className="bg-blue-600 text-white p-2 w-full">
            Verify OTP
          </button>
        </>
      )}
    </form>
  );
}