"use client";

import dynamic from "next/dynamic";

const ServiceForm = dynamic(() => import("./ServiceForm"), { ssr: false });

export default function ServiceFormWrapper({ categoryId }: { categoryId: number }) {
  return <ServiceForm categoryId={categoryId} />;
}
