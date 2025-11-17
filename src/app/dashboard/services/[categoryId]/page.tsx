/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import CategoryServicesList from "./CategoryServicesList"; // Import the new Client Component
import { getServiceCategories } from "../categories/actions"; // Import server action for category
import { getServices } from "../actions"; // Import server action for services
import { getAllUserBusinesses } from "../../businesses/actions"; // Import server action for businesses
import ServiceFormWrapper from "./ServiceFormWrapper"; // Import the new Client Component
import { notFound } from "next/navigation"; // Import notFound
import { getSession } from "@/app/login/actions";

export default async function CategoryServicesPage(props: any) { // Changed props to any
  const { params, searchParams } = props; // Destructure params and searchParams from props
  const categoryId = parseInt(params.categoryId as string);
  console.log("CategoryServicesPage: categoryId", categoryId);

  const session = await getSession();
  if (!session || !session.user) {
    notFound();
  }

  // Fetch category details
  const allCategories = await getServiceCategories();
  console.log("CategoryServicesPage: allCategories", allCategories);
  const category = allCategories.find(cat => cat.id === categoryId);
  console.log("CategoryServicesPage: found category", category);

  if (!category) { // Handle category not found
    notFound();
  }

  // Fetch services for this category
  const services = await getServices({ categoryId });
  console.log("CategoryServicesPage: services for category", services);

  // Fetch user's businesses
  const businesses = await getAllUserBusinesses(session.user.id);

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
        <ServiceFormWrapper categoryId={categoryId} businesses={businesses} /> {/* Render the new wrapper */}

        {/* Right Column: Services in this Category */}
        <CategoryServicesList category={category} services={services} /> {/* Pass category and services as props */}
      </div>
    </div>
  );
}
