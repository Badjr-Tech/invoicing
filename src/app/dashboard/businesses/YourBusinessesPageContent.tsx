"use client";

import { useState, useEffect } from "react";
import { SessionPayload, fetchSession } from "@/app/login/actions";
import { useRouter } from "next/navigation";

export default function YourBusinessesPageContent() {
  const router = useRouter();
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSessionData() {
      const currentSession = await fetchSession();
      setSession(currentSession);
      setLoading(false);
    }
    getSessionData();
  }, []);

  if (loading) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  if (!session || !session.user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground">Your Businesses (Minimal)</h1>
      <p className="mt-4 text-foreground">This is a minimal version of the Your Businesses page.</p>
    </div>
  );
}