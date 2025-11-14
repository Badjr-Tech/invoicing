"use client";

import { useState } from "react";
import ServiceCategoriesList from "./ServiceCategoriesList";
import dynamic from "next/dynamic";
import AddCategoryModal from "../components/AddCategoryModal";

const ServiceCategoryForm = dynamic(() => import("./ServiceCategoryForm"), { ssr: false });

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Service Categories</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Add New Category (now in modal) */}
        {/* <ServiceCategoryForm /> */} {/* Moved to modal */}

        {/* Right Column: Your Categories */}
        <ServiceCategoriesList />
      </div>

      <AddCategoryModal isOpen={isModalOpen} onClose={closeModal} title="Add New Service Category">
        <ServiceCategoryForm onSubmissionSuccess={closeModal} />
      </AddCategoryModal>
    </div>
  );
}