"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import useUserStorage from "@/hooks/useUserStorage";
import { addOrUpdateUser } from "@/lib/firebase-client-services";

// Create a separate component for the authenticated state
const AuthenticatedButtons = ({ router, signOutHandler }) => (
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
      onClick={signOutHandler}
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
  const { saveUserId } = useUserStorage();

  // Only render after initial client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Store user ID in localStorage when session changes
  useEffect(() => {
    if (session?.user) {
      // Create a unique Firebase-compatible user ID from email
      const handleUserData = async () => {
        try {
          // Use the user's email as a unique identifier for Firebase
          const userId = btoa(session.user.email).replace(/[+/=]/g, "");

          // Store user data in Firestore and localStorage
          await addOrUpdateUser(userId, {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          });

          // Save the user ID to localStorage
          await saveUserId({
            uid: userId,
            email: session.user.email,
            displayName: session.user.name,
            photoURL: session.user.image,
          });

          console.log("User data stored successfully");
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      };

      handleUserData();
    }
  }, [session, saveUserId]);

  // Handle sign-in with redirection
  const handleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  // Handle sign-out with cleanup
  const handleSignOut = async () => {
    try {
      // Clear user from localStorage
      await saveUserId(null);
      // Sign out from NextAuth
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Show a loading state until client-side hydration is complete
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
    <AuthenticatedButtons router={router} signOutHandler={handleSignOut} />
  ) : (
    <UnauthenticatedButton handleSignIn={handleSignIn} />
  );
}
