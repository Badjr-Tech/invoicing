"use client";

// import { createServiceCategory } from "./categories/actions";
// import { useFormState } from "react-dom";
// import ServiceCategoriesList from "./ServiceCategoriesList"; // Import the new Server Component
// import Link from "next/link"; // No longer needed for this simplified version

// export type FormState = {
//   message: string;
//   error: string;
// } | undefined;

// const INITIAL_STATE: FormState = {
//   message: "",
//   error: "",
// };

export default function ServicesPage() { // Removed async
  // const [state, formAction] = useFormState<FormState, FormData>(createServiceCategory, INITIAL_STATE); // Use INITIAL_STATE

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Services Page (Simplified for Debugging)</h1>
      <p>If you see this, the page is loading. We are debugging a hydration error.</p>
    </div>
  );
}