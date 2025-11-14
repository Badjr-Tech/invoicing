"use client";

import ServiceCategoriesList from "./ServiceCategoriesList"; // Import the Server Component

export default function ServicesPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Service Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Right Column: Your Categories */}
        <ServiceCategoriesList />
      </div>
    </div>
  );
}