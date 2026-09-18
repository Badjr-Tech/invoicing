import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Seven days of full access to AGENCY. No card required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
