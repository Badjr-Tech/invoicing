import { redirect } from "next/navigation";
import { getSession } from "@/app/login/actions";
import LogoutButton from "@/app/components/LogoutButton";
import Link from "next/link";
import { getAllUserBusinesses } from "./businesses/actions";
// import AdminViewToggle from "./components/AdminViewToggle"; // New import
// import { headers, cookies } from "next/headers"; // New import for searchParams and cookies

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const businesses = await getAllUserBusinesses(session.user.id); // Fetch businesses
  const isAdmin = session.user.role === 'admin';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="relative w-64 bg-secondary text-white px-4 pt-12 space-y-6">
        <nav className="space-y-2 font-semibold text-white">
          <Link
            href="/dashboard"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
          >
            Home
          </Link>
          <Link
            href="/dashboard/messages"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
          >
            Messages
          </Link>
          <Link
            href="/dashboard/resources"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
          >
            Resources
          </Link>
          <Link
            href="/dashboard/admin/businesses/manage"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
          >
            Business search
          </Link>
          <Link
            href="/dashboard/hth-class"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
          >
            Page 2
          </Link>
          <Link
            href="/dashboard/businesses"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
          >
            Businesses
          </Link>
          {businesses.map((business) => (
            <Link
              key={business.id}
              href={`/dashboard/businesses/${business.id}`}
              className="block py-2 px-6 text-sm rounded transition duration-200 hover:bg-primary"
            >
              - {business.businessName}
            </Link>
          ))}
          <h2 className="text-lg font-semibold text-light-gray uppercase mt-6 mb-2">
            Advice & Info
          </h2>
          <h2 className="text-lg font-semibold text-light-gray uppercase mt-6 mb-2">
            Business Tools
          </h2>
          <h2 className="text-lg font-semibold text-light-gray uppercase mt-6 mb-2">
            Financial Tools
          </h2>
          <Link
            href="/dashboard/invoicing"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
          >
            Invoicing
          </Link>
          <h2 className="text-lg font-semibold text-light-gray uppercase mt-6 mb-2">
            Products
          </h2>
          {isAdmin && (
            <>
              <h2 className="text-lg font-semibold text-light-gray uppercase mt-6 mb-2">
                Admin Tools
              </h2>
              <Link
                href="/dashboard/admin/users"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
              >
                Admin Users
              </Link>
              <Link
                href="/dashboard/admin/hth-class"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary"
              >
                Admin HTH Class
              </Link>
            </>
          )}
        </nav>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <Link
            href="/dashboard/profile"
            className="py-2.5 px-4 rounded transition duration-200 hover:bg-primary text-sm font-semibold"
          >
            Profile
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col text-foreground p-6">
        {children}
        <footer className="mt-auto py-4 text-center text-sm text-foreground">
          Tech By Badjr
        </footer>
      </main>
    </div>
  );
}
