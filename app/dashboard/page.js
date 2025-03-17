import { requireAuth } from "@/utils/auth";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}
