
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Server-side functions
export async function getCurrentUser() {
  try {
    // Note: We're getting the session without authOptions since it might not be accessible here
    const session = await getServerSession();
    return session?.user;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    // Use a more reliable way to redirect on the server
    return redirect("/");
  }

  return user;
}

// Client-side function
export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return { session, status };
}
