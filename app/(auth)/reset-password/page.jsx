'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Missing reset token");
    
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully!");
        router.push('/login');
      } else {
        toast.error(data.error || "Failed to reset");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="text-red-400 text-center">Invalid or missing token</div>;
  }

  return (
    <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">New Password</h1>
        <p className="text-gray-400">Please enter your new secure password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="input-inset w-full bg-dark-100/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-clay w-full flex items-center justify-center py-3 text-lg font-semibold mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}