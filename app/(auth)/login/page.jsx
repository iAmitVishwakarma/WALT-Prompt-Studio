'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        // Show specific error from NextAuth
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.success("Login successful! Redirecting...");
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to access your prompt vault</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="input-inset w-full bg-dark-100/50"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <Link href="/forgot-password" class="text-xs text-accent-1 hover:text-accent-2 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="input-inset w-full bg-dark-100/50"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-clay w-full flex items-center justify-center py-3 text-lg font-semibold mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-accent-1 hover:text-accent-2 font-medium transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
}