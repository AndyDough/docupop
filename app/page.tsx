"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LinedPaper from "@/components/LinedPaper";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, loading, signOut } = useAuth();

  const handleAuthSuccess = () => {
    // Auth state will be updated automatically by AuthProvider
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <LinedPaper className="absolute inset-x-0 bottom-0 z-[-1] h-5/6 opacity-60" />
        <header className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
          <div className="text-lg font-bold text-gray-900">DOCUPOP</div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-8xl font-bold text-gray-900">DOCUPOP</h1>
          <p className="mt-4 max-w-2xl text-2xl text-gray-600">
            Parse and organize your documents effortlessly and efficiently.
          </p>
          <div className="mt-8">
            {showSignUp ? (
              <SignUpForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setShowSignUp(false)}
              />
            ) : (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToSignUp={() => setShowSignUp(true)}
              />
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <LinedPaper className="absolute inset-x-0 bottom-0 z-[-1] h-5/6 opacity-60" />
      <header className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">DOCUPOP</div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSignOut}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-8xl font-bold text-gray-900">Welcome to DOCUPOP</h1>
        <p className="mt-4 max-w-2xl text-2xl text-gray-600">
          You are successfully authenticated! Ready to manage your documents.
        </p>
        <div className="mt-8">
          <button
            onClick={() => router.push('/documents')}
            className="rounded-md bg-blue-500 px-6 py-3 text-lg text-white hover:bg-blue-600"
          >
            Manage Documents
          </button>
        </div>
      </main>
    </div>
  );
}