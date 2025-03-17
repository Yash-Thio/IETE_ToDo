import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return user;
}
