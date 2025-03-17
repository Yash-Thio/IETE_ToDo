"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Create a separate component for the authenticated state
const AuthenticatedButtons = ({ router }) => (
  <>
    <Button
      onClick={() => router.push("/dashboard")}
      size="sm"
      className="bg-zinc-200 text-zinc-900 hover:bg-zinc-100 mr-2"
    >
      Go to Dashboard
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </Button>
  </>
);

// Create a separate component for the unauthenticated state
const UnauthenticatedButton = ({ handleSignIn }) => (
  <Button
    variant="outline"
    size="sm"
    className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
    onClick={handleSignIn}
  >
    Sign In
  </Button>
);

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handle sign-in
  const handleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  // Only render after initial client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a loading state that's identical for both server and client render
  // This prevents hydration mismatch
  if (!mounted || status === "loading") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
        disabled
      >
        Loading...
      </Button>
    );
  }

  // Only render auth-dependent UI after client-side hydration
  return session ? (
    <AuthenticatedButtons router={router} />
  ) : (
    <UnauthenticatedButton handleSignIn={handleSignIn} />
  );
}
