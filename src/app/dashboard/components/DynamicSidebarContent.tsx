"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/app/login/actions";
import { getAllUserBusinesses } from "../businesses/actions";
import LogoutButton from "@/app/components/LogoutButton";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

interface Business {
  id: number;
  businessName: string;
}

interface UserSession {
  user: {
    id: number;
    role: string;
  };
}

export default function DynamicSidebarContent() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const userSession = await getSession();
      if (!userSession || !userSession.user) {
        redirect("/login");
        return;
      }
      setSession(userSession as UserSession);

      const userBusinesses = await getAllUserBusinesses(userSession.user.id);
      setBusinesses(userBusinesses);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">Loading sidebar...</div>
    );
  }

  const isAdmin = session?.user?.role === 'admin';

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link
          href="/dashboard/profile"
          className="py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs font-semibold"
        >
          Profile
        </Link>
        <LogoutButton />
      </div>
      <div className="mb-4 text-center">
        <Image src="/yellow.png" alt="Logo" width={100} height={100} className="mx-auto" />
      </div>
      <nav className="space-y-0.5 font-semibold text-white">
        <Link
          href="/dashboard"
          className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
        >
          Home
        </Link>
        
        {/* Advice & Info Section - Now a direct link */}
        <Link
          href="/dashboard/advice-info" // Assuming this will be the landing page for Advice & Info
          className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs uppercase mt-4 mb-1"
        >
          Advice & Info
        </Link>

        {/* Business Tools Section - Now a direct link */}
        <Link
          href="/dashboard/business-tools" // Assuming this will be the landing page for Business Tools
          className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs uppercase mt-4 mb-1"
        >
          Business Tools
        </Link>

        {/* Financial Tools Section - Now a direct link */}
        <Link
          href="/dashboard/financial-tools" // This is the Financial Tools landing page
          className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs uppercase mt-4 mb-1"
        >
          Financial Tools
        </Link>

        {isAdmin && (
          <>
            {/* Admin Tools Section - Now a direct link */}
            <Link
              href="/dashboard/admin" // Assuming this will be the landing page for Admin Tools
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs uppercase mt-4 mb-1"
            >
              Admin Tools
            </Link>
          </>
        )}
      </nav>
    </>
  );
}
