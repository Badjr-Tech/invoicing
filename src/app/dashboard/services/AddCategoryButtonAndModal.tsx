"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AddCategoryModal from "@/app/dashboard/components/AddCategoryModal";

const ServiceCategoryForm = dynamic(() => import("./ServiceCategoryForm"), { ssr: false });

export default function AddCategoryButtonAndModal({ businesses }: { businesses: { id: number; businessName: string; dbas: { id: number; dbaName: string }[] }[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Category
      </button>

      <AddCategoryModal isOpen={isModalOpen} onClose={closeModal} title="Add New Service Category">
        <ServiceCategoryForm onSubmissionSuccess={closeModal} businesses={businesses} />
      </AddCategoryModal>
    </>
  );
}
