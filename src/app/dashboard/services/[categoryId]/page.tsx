import Link from "next/link";
import CategoryServicesList from "./CategoryServicesList"; // Import the new Client Component
import { getServiceCategories } from "../categories/actions"; // Import server action for category
import { getServices } from "../actions"; // Import server action for services
import ServiceFormWrapper from "./ServiceFormWrapper"; // Import the new Client Component
import { notFound } from "next/navigation"; // Import notFound

export default async function CategoryServicesPage({
  params,
  searchParams, // Added searchParams as a placeholder
}: {
  params: { categoryId: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // Added searchParams type
}) {
  const categoryId = parseInt(params.categoryId as string);

  // Fetch category details
  const allCategories = await getServiceCategories();
  const category = allCategories.find(cat => cat.id === categoryId);

  if (!category) { // Handle category not found
    notFound();
  }

  // Fetch services for this category
  const services = await getServices(categoryId);

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Services in Category: {category.name} {category.customId && <span className="text-gray-500 text-xl">({category.customId})</span>}
        </h1>
        <Link href="/dashboard/services" className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Back to Categories
        </Link>
      </div>
      {category.description && <p className="text-lg text-gray-600 mb-6">{category.description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Add New Service */}
        <ServiceFormWrapper categoryId={categoryId} /> {/* Render the new wrapper */}

        {/* Right Column: Services in this Category */}
        <CategoryServicesList category={category} services={services} /> {/* Pass category and services as props */}
      </div>
    </div>
  );
}
