// "use client"; // Removed

// import { createServiceCategory } from "./categories/actions"; // No longer needed here
// import { useFormState } from "react-dom"; // No longer needed here
import ServiceCategoriesList from "./ServiceCategoriesList"; // Import the new Server Component
// import Link from "next/link"; // No longer needed here
import dynamic from "next/dynamic"; // Import dynamic

// FormState type moved to ServiceCategoryForm.tsx

// const INITIAL_STATE: FormState = { // No longer needed here
//   message: "",
//   error: "",
// };

const ServiceCategoryForm = dynamic(() => import("./ServiceCategoryForm"), { ssr: false }); // Dynamically import with ssr: false

export default async function ServicesPage() { // Made async
  // const [state, formAction] = useFormState<FormState, FormData>(createServiceCategory, INITIAL_STATE); // No longer needed here

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Service Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Add New Category */}
        <ServiceCategoryForm /> {/* Render the dynamically imported Client Component */}

        {/* Right Column: Your Categories */}
        <ServiceCategoriesList /> {/* Render the Server Component here */}
      </div>
    </div>
  );
}