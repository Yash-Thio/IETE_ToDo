"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    // Redirect to dashboard after sign in (only on first login)
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
          disabled
        >
          Loading...
        </Button>
      </>
    );
  }

  if (session) {
    return (
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
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
        onClick={handleSignIn}
      >
        Sign In
      </Button>
    </>
  );
}
