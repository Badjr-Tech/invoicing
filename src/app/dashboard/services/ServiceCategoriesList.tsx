"use client";

import Link from "next/link";
import { InferSelectModel } from "drizzle-orm";
import { serviceCategories } from "@/db/schema";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryModal";

type ServiceCategory = InferSelectModel<typeof serviceCategories> & {
  business?: { businessName: string } | null; // Include business relation
};

export default function ServiceCategoriesList({ categories, businesses }: { categories: ServiceCategory[]; businesses: { id: number; businessName: string }[] }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [collapsedBusinesses, setCollapsedBusinesses] = useState<Record<number, boolean>>({});
  const [collapsedUnassigned, setCollapsedUnassigned] = useState<boolean>(false);

  const handleEditClick = (category: ServiceCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
  };

  const toggleBusinessCollapse = (businessId: number) => {
    setCollapsedBusinesses(prevState => ({
      ...prevState,
      [businessId]: !prevState[businessId],
    }));
  };

  const toggleUnassignedCollapse = () => {
    setCollapsedUnassigned(prevState => !prevState);
  };

  const categoriesByBusiness: { [key: number]: ServiceCategory[] } = {};
  const unassignedCategories: ServiceCategory[] = [];

  categories.forEach(category => {
    if (category.businessId) {
      if (!categoriesByBusiness[category.businessId]) {
        categoriesByBusiness[category.businessId] = [];
      }
      categoriesByBusiness[category.businessId].push(category);
    } else {
      unassignedCategories.push(category);
    }
  });

  return (
    <div className="col-span-full"> {/* Make it full width */}
      <ul className="space-y-4">
        {businesses.map(business => (
          <li key={business.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleBusinessCollapse(business.id)}>
              <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                <span className="mr-2">{collapsedBusinesses[business.id] ? '▶' : '▼'}</span>
                {business.businessName} Categories
              </h3>
            </div>
            {!collapsedBusinesses[business.id] && (
              <ul className="ml-6 mt-2 space-y-2">
                {categoriesByBusiness[business.id]?.length > 0 ? (
                  categoriesByBusiness[business.id].map(category => (
                    <li key={category.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div>
                        <Link href={`/dashboard/services/${category.id}`} className="font-semibold text-indigo-600 hover:underline">
                          {category.name} {category.customId && <span className="text-gray-500 text-xs">({category.customId})</span>}
                        </Link>
                        {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                      </div>
                      <button
                        onClick={() => handleEditClick(category)}
                        className="ml-4 px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No categories for this business.</p>
                )}
              </ul>
            )}
          </li>
        ))}

        {unassignedCategories.length > 0 && (
          <li className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleUnassignedCollapse}>
              <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                <span className="mr-2">{collapsedUnassigned ? '▶' : '▼'}</span>
                Unassigned Categories
              </h3>
            </div>
            {!collapsedUnassigned && (
              <ul className="ml-6 mt-2 space-y-2">
                {unassignedCategories.map(category => (
                  <li key={category.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div>
                      <Link href={`/dashboard/services/${category.id}`} className="font-semibold text-indigo-600 hover:underline">
                        {category.name} {category.customId && <span className="text-gray-500 text-xs">({category.customId})</span>}
                      </Link>
                      {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                    </div>
                    <button
                      onClick={() => handleEditClick(category)}
                      className="ml-4 px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}

        {businesses.length === 0 && unassignedCategories.length === 0 && (
          <p>No service categories found. Add one to get started!</p>
        )}
      </ul>

      {editingCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          category={editingCategory}
          businesses={businesses} // Pass businesses to EditCategoryModal
        />
      )}
    </div>
  );
}
