import { redirect } from "next/navigation";
import { getSession } from "@/app/login/actions"; // Keep getSession for initial redirect check
import DynamicSidebarContent from "@/app/dashboard/components/DynamicSidebarContent"; // Import the new Client Component

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
      {/* Sidebar */}
      <aside className="relative w-64 bg-secondary text-white px-4 pt-4 space-y-2">
        <DynamicSidebarContent /> {/* Render the Client Component here */}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col text-foreground p-6 overflow-x-hidden">
        {children}
        <footer className="mt-auto py-4 text-center text-sm text-foreground">
          Tech By Badjr
        </footer>
      </main>
    </div>
  );
}
