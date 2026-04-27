'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Nexus CRM</h1>
          <p className="mt-4 text-lg text-indigo-100">
            Streamline your sales pipeline, manage customers, and grow your business with our powerful CRM platform.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-xs text-indigo-200">Active Users</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">95%</p>
              <p className="text-xs text-indigo-200">Satisfaction</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">50M+</p>
              <p className="text-xs text-indigo-200">Deals Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Nexus CRM</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Sign up
            </Link>
          </p>

          <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
              <div>Admin: admin@crm.com</div>
              <div>Manager: manager@crm.com</div>
              <div>Sales: james@crm.com</div>
              <div>Support: lisa@crm.com</div>
            </div>
            <p className="mt-1 text-xs text-gray-400">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
