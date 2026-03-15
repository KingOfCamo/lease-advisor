import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(searchParams.callbackUrl || "/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" />
                <path d="M16 6h.01" />
                <path d="M12 6h.01" />
                <path d="M12 10h.01" />
                <path d="M12 14h.01" />
                <path d="M16 10h.01" />
                <path d="M16 14h.01" />
                <path d="M8 10h.01" />
                <path d="M8 14h.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Client Portal</h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to access your lease analysis.
            </p>
          </div>

          <LoginForm
            callbackUrl={searchParams.callbackUrl || "/dashboard"}
            error={searchParams.error}
          />

          <p className="mt-6 text-center text-xs text-gray-400">
            Need access?{" "}
            <a href="/contact" className="text-navy-600 hover:underline">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
