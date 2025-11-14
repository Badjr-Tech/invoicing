// "use client"; // Removed

import { getServiceCategories } from "./categories/actions"; // Import server action
import ServiceCategoriesList from "./ServiceCategoriesList"; // Import the new Client Component
import AddCategoryButtonAndModal from "./AddCategoryButtonAndModal"; // Import the new Client Component

export default async function ServicesPage() { // Made async
  const categories = await getServiceCategories(); // Fetch categories in Server Component

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Service Categories</h1>
        <AddCategoryButtonAndModal /> {/* Render the Client Component here */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Right Column: Your Categories */}
        <ServiceCategoriesList categories={categories} /> {/* Pass categories as prop */}
      </div>
    </div>
  );
}