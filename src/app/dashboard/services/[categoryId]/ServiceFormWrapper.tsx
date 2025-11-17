"use client";

import dynamic from "next/dynamic";
import { Business } from "@/db/schema";

const ServiceForm = dynamic(() => import("./ServiceForm"), { ssr: false });

export default function ServiceFormWrapper({ categoryId, businesses }: { categoryId: number, businesses: Business[] }) {
  return <ServiceForm categoryId={categoryId} businesses={businesses} />;
}
