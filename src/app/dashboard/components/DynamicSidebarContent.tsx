"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  Home,
  LayoutGrid,
  MessageSquare,
  Settings,
  Shield,
  Wallet,
} from "lucide-react";
import { fetchSession } from "@/app/login/actions";
import { getAllUserBusinesses } from "../businesses/actions";
import { getUserProducts } from "../products/actions";
import LogoutButton from "@/app/components/LogoutButton";

interface Business {
  id: number;
  businessName: string;
}

interface UserProduct {
  id: number;
  productId: string;
}

interface UserSession {
  user: {
    id: number;
    role: string;
  };
}

/**
 * Sidebar navigation.
 *
 * Design rules, learned the hard way:
 *  - No full-width hover highlights. Rest state is quiet text; hover shifts
 *    color; only the ACTIVE route gets a filled pill. One highlight at a
 *    time, and it means "you are here", not "your mouse is here".
 *  - Sections are disclosure groups with a rotating chevron, not text arrows.
 *  - The current section auto-opens based on the route.
 */

type NavChild = { label: string; href: string };
type NavSection = {
  id: string;
  label: string;
  icon: typeof Home;
  children: NavChild[];
};

const linkBase =
  "flex items-center gap-2.5 rounded-control px-3 py-2 text-[13px] font-medium transition-colors";
const restLink = `${linkBase} text-sage-200/80 hover:text-white`;
const activeLink = `${linkBase} bg-sage-700/70 text-white`;

function SectionHeader({
  label,
  icon: Icon,
  open,
  onClick,
}: {
  label: string;
  icon: typeof Home;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-[13px] font-semibold text-sage-100 transition-colors hover:text-white"
      aria-expanded={open}
    >
      <Icon size={16} className="shrink-0 text-sage-300" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight
        size={14}
        className={`shrink-0 text-sage-400 transition-transform ${open ? "rotate-90" : ""}`}
      />
    </button>
  );
}

export default function DynamicSidebarContent() {
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const userSession = await fetchSession();
      if (!userSession || !userSession.user) {
        redirect("/login");
        return;
      }
      setSession(userSession as UserSession);

      const userBusinesses = await getAllUserBusinesses(userSession.user.id);
      setBusinesses(userBusinesses);

      const products = await getUserProducts(userSession.user.id);
      setUserProducts(products);

      setLoading(false);
    }
    fetchData();
  }, []);

  const isAdmin = session?.user?.role === "admin";
  const hasBookkeeping = userProducts.some((p) => p.productId === "bookkeeping");

  const sections: NavSection[] = [
    {
      id: "business",
      label: "My Business",
      icon: Briefcase,
      children: [
        { label: "Businesses", href: "/dashboard/businesses" },
        ...businesses.map((b) => ({
          label: b.businessName,
          href: `/dashboard/businesses/${b.id}`,
        })),
        { label: "Contractors", href: "/dashboard/business-tools/contractors" },
        { label: "Compliance", href: "/dashboard/business-compliance" },
      ],
    },
    {
      id: "money",
      label: "Money",
      icon: Wallet,
      children: [
        { label: "Financials Dashboard", href: "/dashboard/financial-tools/dashboard" },
        { label: "Invoices", href: "/dashboard/invoicing" },
        { label: "Clients", href: "/dashboard/clients" },
        { label: "Services", href: "/dashboard/services" },
        { label: "Budget", href: "/dashboard/financial-tools/budget" },
        { label: "Contracts", href: "/dashboard/financial-tools/contracts" },
        ...(hasBookkeeping
          ? [
              { label: "Bookkeeping", href: "/dashboard/products/bookkeeping" },
              { label: "Reports", href: "/dashboard/financial-tools/bookkeeping/reports" },
            ]
          : []),
      ],
    },
    {
      id: "products",
      label: "Products",
      icon: LayoutGrid,
      children: [
        { label: "Browse products", href: "/dashboard/products" },
        ...userProducts.map((p) => ({
          label: p.productId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          href: `/dashboard/products/${p.productId}`,
        })),
      ],
    },
    {
      id: "learn",
      label: "Learn & Grow",
      icon: BookOpen,
      children: [
        { label: "Resources", href: "/dashboard/resources" },
        { label: "Scaling Your Business", href: "/dashboard/scaling-your-business" },
        { label: "Courses", href: "/dashboard/courses" },
      ],
    },
    ...(isAdmin
      ? [
          {
            id: "admin",
            label: "Admin",
            icon: Shield,
            children: [
              { label: "Business search", href: "/dashboard/admin/businesses/manage" },
              { label: "Users", href: "/dashboard/admin/users" },
              { label: "AGENCY Class", href: "/dashboard/admin/agency-class" },
              { label: "Records", href: "/dashboard/admin/records" },
              { label: "Agency Set Up", href: "/dashboard/admin/agency-setup" },
              { label: "Checklists", href: "/dashboard/admin/agency-setup/checklist-management" },
            ],
          } satisfies NavSection,
        ]
      : []),
  ];

  // Open the section the current route lives in — once, when the sidebar
  // first knows its data. Re-running this on every navigation forced sections
  // open against the member's own clicks and made the list jump around.
  useEffect(() => {
    if (loading || openSection !== null || !pathname) return;
    const owner = sections.find((section) =>
      section.children.some((child) => pathname.startsWith(child.href)),
    );
    if (owner) setOpenSection(owner.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) {
    return (
      <div className="space-y-2.5 p-4" aria-label="Loading navigation">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-control bg-sage-700/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 pb-5 pt-2">
        <Image src="/agency-logo-light.svg" alt="" width={30} height={30} />
        <span className="font-display text-base font-bold tracking-wide text-white">
          AGENCY
        </span>
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1">
        <Link
          href="/dashboard"
          className={pathname === "/dashboard" ? activeLink : restLink}
        >
          <Home size={16} className="shrink-0 text-sage-300" />
          Home
        </Link>
        <Link
          href="/dashboard/messages"
          className={pathname?.startsWith("/dashboard/messages") ? activeLink : restLink}
        >
          <MessageSquare size={16} className="shrink-0 text-sage-300" />
          Messages
        </Link>

        <div className="pt-3" />

        {sections.map((section) => {
          const open = openSection === section.id;
          return (
            <div key={section.id}>
              <SectionHeader
                label={section.label}
                icon={section.icon}
                open={open}
                onClick={() => setOpenSection(open ? null : section.id)}
              />
              {open && (
                <div className="mb-1.5 ml-[1.15rem] space-y-0.5 border-l border-sage-700 pl-3">
                  {section.children.map((child) => (
                    <Link
                      key={child.href + child.label}
                      href={child.href}
                      className={`block rounded-control px-2.5 py-1.5 text-[13px] transition-colors ${
                        pathname === child.href
                          ? "bg-sage-700/70 font-medium text-white"
                          : "text-sage-200/70 hover:text-white"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center justify-between border-t border-sage-700 px-1 py-3">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-control px-2 py-1.5 text-[13px] font-medium text-sage-200/80 transition-colors hover:text-white"
        >
          <Settings size={15} className="text-sage-300" />
          Profile
        </Link>
        <LogoutButton onDark />
      </div>
    </div>
  );
}
