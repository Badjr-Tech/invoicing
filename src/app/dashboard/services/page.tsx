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
        {/* Left Column: Explanatory Text */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Categorize Services?</h2>
          <p className="text-gray-700 mb-4">
            Creating service categories and assigning service cost codes/IDs is one of the simplest ways for a small business owner to produce cleaner, more professional invoices. Categories group similar tasks—like “Consulting,” “Design,” or “Admin Support”—so clients can quickly understand what they’re being billed for. Cost codes/IDs keep each service consistent, preventing typos or mismatched descriptions and making every invoice look polished and organized.
          </p>
          <p className="text-gray-700 mb-4">
            Beyond invoicing, these codes are incredibly helpful for reporting and business insights. When each service is categorized and coded, you can easily track which offerings generate the most revenue, monitor trends over time, and understand where your time is actually going. This structure gives you cleaner data, smoother bookkeeping, and stronger decision-making as your business grows.
          </p>
          <p className="text-gray-700 font-semibold">
            Overall, service categories + cost codes = cleaner invoices today and clearer reporting tomorrow.
          </p>
        </div>

        {/* Right Column: Your Categories */}
        <ServiceCategoriesList categories={categories} /> {/* Pass categories as prop */}
      </div>
    </div>
  );
}