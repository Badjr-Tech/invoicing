"use client";

// import { createService } from "../actions"; // No longer needed here
// import { useFormState } from "react-dom"; // No longer needed here
import Link from "next/link";
import CategoryServicesList from "./CategoryServicesList"; // Import the new Server Component
import { useParams } from "next/navigation"; // Import useParams
import dynamic from "next/dynamic"; // Import dynamic

export type FormState = {
  message: string;
  error: string;
} | undefined;

// const INITIAL_STATE: FormState = { // No longer needed here
//   message: "",
//   error: "",
// };

const ServiceForm = dynamic(() => import("./ServiceForm"), { ssr: false }); // Dynamically import with ssr: false

export default function CategoryServicesPage() { // Removed params from props
  const params = useParams(); // Use useParams hook
  const categoryId = parseInt(params.categoryId as string);

  // const [state, formAction] = useFormState<FormState, FormData>(createService, INITIAL_STATE); // No longer needed here

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Services in Category
        </h1>
        <Link href="/dashboard/services" className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Back to Categories
        </Link>
      </div>
      {/* The category description will be rendered by CategoryServicesList */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Add New Service */}
        <ServiceForm categoryId={categoryId} /> {/* Render the dynamically imported Client Component */}

        {/* Right Column: Services in this Category */}
        <CategoryServicesList categoryId={categoryId} /> {/* Render the Server Component here */}
      </div>
    </div>
  );
}
