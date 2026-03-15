"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <>
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-navy-900"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-navy-900"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Client Portal</h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to view your projects and lease analysis.
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-xs text-gray-400">
            Need access?{" "}
            <Link href="/contact" className="text-navy-600 hover:underline">
              Contact Ben
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
