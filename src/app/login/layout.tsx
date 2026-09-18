import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to AGENCY to pick up where you left off.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
