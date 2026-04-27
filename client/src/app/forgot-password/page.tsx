'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="mt-1 text-sm text-gray-500">We&apos;ll send you a reset link</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Check your email</h3>
              <p className="mt-2 text-sm text-gray-500">We&apos;ve sent a password reset link to {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>
        <p className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            <ArrowLeft className="h-3 w-3" /> Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
