"use client";

import Link from "next/link";
import { InferSelectModel } from "drizzle-orm";
import { serviceCategories, services as servicesSchema } from "@/db/schema";
import { deleteService } from "../actions";
import { useTransition, useState } from "react";
import EditServiceModal from "../EditServiceModal";

type ServiceCategory = InferSelectModel<typeof serviceCategories>;
type Service = InferSelectModel<typeof servicesSchema>;

export default function CategoryServicesList({ category, services }: { category: ServiceCategory, services: Service[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = (serviceId: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      startTransition(async () => {
        await deleteService(serviceId);
      });
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
  };

  const handleCloseModal = () => {
    setEditingService(null);
  };

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
              <div className="flex items-center space-x-2">
                <button onClick={() => handleEditClick(service)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Edit</button>
                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={isPending}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={handleCloseModal}
          onSubmissionSuccess={() => {
            // Optionally, you can add a success message here
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}
