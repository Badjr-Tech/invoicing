"use client"; // Added

// import { getServiceCategories } from "../categories/actions"; // Removed
// import { getServices } from "../actions"; // Removed
// import { notFound } from "next/navigation"; // Removed
import Link from "next/link";
import { InferSelectModel } from "drizzle-orm"; // Import InferSelectModel
import { serviceCategories, services as servicesSchema } from "@/db/schema"; // Import schemas

type ServiceCategory = InferSelectModel<typeof serviceCategories>; // Define ServiceCategory type
type Service = InferSelectModel<typeof servicesSchema>; // Define Service type

export default function CategoryServicesList({ category, services }: { category: ServiceCategory, services: Service[] }) { // Use ServiceCategory and Service types
  console.log("CategoryServicesList: category prop", category);
  console.log("CategoryServicesList: services prop", services);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Services</h2>
      <ul className="space-y-4">
        {services.length === 0 ? (
          <p>No services found in this category. Add one using the form!</p>
        ) : (
          services.map((service) => (
            <li key={service.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{service.name}</p>
                {service.description && <p className="text-sm text-gray-600">{service.description}</p>}
                <p className="text-sm font-bold">${parseFloat(service.price).toFixed(2)}</p>
              </div>
              {/* Add edit/delete buttons here later */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
