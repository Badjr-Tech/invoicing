"use client"; // Added

import Link from "next/link";
import { InferSelectModel } from "drizzle-orm"; // Import InferSelectModel
import { serviceCategories } from "@/db/schema"; // Import serviceCategories
import { useState } from "react"; // Import useState
import EditCategoryModal from "./EditCategoryModal"; // Import EditCategoryModal

type ServiceCategory = InferSelectModel<typeof serviceCategories>; // Define ServiceCategory type

export default function ServiceCategoriesList({ categories }: { categories: ServiceCategory[] }) { // Use ServiceCategory type
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);

  const handleEditClick = (category: ServiceCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Categories</h2>
      <ul className="space-y-4">
        {categories.length === 0 ? (
          <p>No service categories found. Add one to get started!</p>
        ) : (
          categories.map((category) => (
            <li key={category.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
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
        )}
      </ul>

      {editingCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          category={editingCategory}
        />
      )}
    </div>
  );
}
