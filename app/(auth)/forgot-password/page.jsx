'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
        toast.success("Reset link sent!");
      } else {
        toast.error("Failed to send link");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your terminal/email</h2>
        <p className="text-gray-400 mb-6">We've sent a password reset link to <strong>{email}</strong>.</p>
        <Link href="/login" className="btn-clay w-full block text-center py-3">
            Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl">
      <Link href="/login" className="flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
      </Link>
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-400">Enter your email to receive reset instructions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="input-inset w-full bg-dark-100/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-clay w-full flex items-center justify-center py-3 text-lg font-semibold mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}