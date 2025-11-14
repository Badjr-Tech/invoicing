/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

export default async function CategoryServicesPage({
  params,
}: {
  params: any; // Changed to any for debugging
}) {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Category Services Page Test</h1>
      <p>Category ID: {params.categoryId}</p>
      <Link href="/dashboard/services" className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
        Back to Categories
      </Link>
    </div>
  );
}
