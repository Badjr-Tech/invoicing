import { redirect } from "next/navigation";
import { getSession } from "@/app/login/actions";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Simplified Sidebar */}
      <aside className="relative w-64 bg-secondary text-white px-4 pt-4">
        <nav className="space-y-2">
          <Link href="/dashboard" className="block py-2.5 px-4 rounded hover:bg-primary">Home</Link>
          <Link href="/dashboard/services" className="block py-2.5 px-4 rounded hover:bg-primary">Services</Link>
          {/* Add other essential links if needed for navigation, but keep it minimal */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col text-foreground p-6">
        {children}
      </main>
    </div>
  );
}
