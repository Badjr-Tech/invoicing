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
  const [adviceInfoCollapsed, setAdviceInfoCollapsed] = useState(true);
  const [businessToolsCollapsed, setBusinessToolsCollapsed] = useState(true);
  const [financialToolsCollapsed, setFinancialToolsCollapsed] = useState(true);
  const [adminToolsCollapsed, setAdminToolsCollapsed] = useState(true);

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
        {/* Advice & Info Section */}
        <h2 
          className="text-lg font-semibold text-light-gray uppercase mt-4 mb-1 flex items-center cursor-pointer"
          onClick={() => setAdviceInfoCollapsed(!adviceInfoCollapsed)}
        >
          <span className="mr-2">{adviceInfoCollapsed ? '▶' : '▼'}</span>
          Advice & Info
        </h2>
        {!adviceInfoCollapsed && (
          <>
            <Link
              href="/dashboard/resources"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Resources
            </Link>
            <Link
              href="/dashboard/business-compliance"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Business Compliance
            </Link>
            <Link
              href="/dashboard/business-checklist"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Business Checklist
            </Link>
          </>
        )}
        {/* Business Tools Section */}
        <h2 
          className="text-lg font-semibold text-light-gray uppercase mt-4 mb-1 flex items-center cursor-pointer"
          onClick={() => setBusinessToolsCollapsed(!businessToolsCollapsed)}
        >
          <span className="mr-2">{businessToolsCollapsed ? '▶' : '▼'}</span>
          Business Tools
        </h2>
        {!businessToolsCollapsed && (
          <>
            <Link
              href="/dashboard/messages"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Messages
            </Link>
            <Link
              href="/dashboard/businesses"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Businesses
            </Link>
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/dashboard/businesses/${business.id}`}
                className="block py-1 px-6 text-xs rounded transition duration-200 hover:bg-primary"
              >
                - {business.businessName}
              </Link>
            ))}
            <Link
              href="/dashboard/business-tools/contractors"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Contractors
            </Link>
            <Link
              href="/dashboard/products"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Products
            </Link>
          </>
        )}
                {/* Financial Tools Section */}
                <Link
                  href="/dashboard/financial-tools"
                  className="text-lg font-semibold text-light-gray uppercase mt-4 mb-1 flex items-center cursor-pointer"
                  onClick={() => setFinancialToolsCollapsed(!financialToolsCollapsed)}
                >
                  <span className="mr-2">{financialToolsCollapsed ? '▶' : '▼'}</span>
                  Financial Tools
                </Link>
                {!financialToolsCollapsed && (
                  <>
                    <Link
                      href="/dashboard/financial-tools/dashboard" // Link to the new Financials Dashboard
                      className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
                    >
                      Financials Dashboard
                    </Link>
                    <Link
                      href="/dashboard/financial-tools/contracts"
                      className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
                    >
                      Contracts
                    </Link>            <Link
              href="/dashboard/invoicing"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Invoicing
            </Link>
            <Link
              href="/dashboard/clients"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Clients
            </Link>
            <Link
              href="/dashboard/services"
              className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
            >
              Services
            </Link>

          </>
        )}
        {isAdmin && (
          <>
            {/* Admin Tools Section */}
            <h2 
              className="text-lg font-semibold text-light-gray uppercase mt-4 mb-1 flex items-center cursor-pointer"
              onClick={() => setAdminToolsCollapsed(!adminToolsCollapsed)}
            >
              <span className="mr-2">{adminToolsCollapsed ? '▶' : '▼'}</span>
              Admin Tools
            </h2>
            {!adminToolsCollapsed && (
              <>
                <Link
                  href="/dashboard/admin/businesses/manage"
                  className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
                >
                  Business search
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
                >
                  Admin Users
                </Link>
                <Link
                  href="/dashboard/admin/agency-class"
                  className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
                >
                  Admin AGENCY Class
                </Link>
                <Link
                  href="/dashboard/admin/records"
                  className="block py-1.5 px-4 rounded transition duration-200 hover:bg-primary text-xs"
                >
                  Admin Records
                </Link>
              </>
            )}
          </>
        )}
      </nav>
    </>
  );
}
