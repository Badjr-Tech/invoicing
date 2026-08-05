"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AddCategoryModal from "@/app/dashboard/components/AddCategoryModal";

const ServiceCategoryForm = dynamic(() => import("./ServiceCategoryForm"), { ssr: false });

export default function AddCategoryButtonAndModal({ businesses }: { businesses: { id: number; businessName: string }[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-ember-600 text-white rounded-md hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
      >
        Add Category
      </button>

      <AddCategoryModal isOpen={isModalOpen} onClose={closeModal} title="Add New Service Category">
        <ServiceCategoryForm onSubmissionSuccess={closeModal} businesses={businesses} />
      </AddCategoryModal>
    </>
  );
}
