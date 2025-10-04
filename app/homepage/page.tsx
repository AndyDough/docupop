'use client';

import LinedPaper from "@/components/LinedPaper";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="relative flex min-h-screen flex-col">
      <LinedPaper className="absolute inset-x-0 bottom-0 z-[-1] h-5/6 opacity-60" />
      <header className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">svg here</div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-900 transition-colors hover:text-gray-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
            >
              Sign in
            </button>
          )}
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-8xl font-bold text-gray-900">DOCUPOP</h1>
        <p className="mt-4 max-w-2xl text-2xl text-gray-600">
          Parse and organize your documents effortlessly and efficiently.
        </p>
      </main>
    </div>
  );
}