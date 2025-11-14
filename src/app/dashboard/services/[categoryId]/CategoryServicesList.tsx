import { getServiceCategories } from "../categories/actions";
import { getServices } from "../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FormState } from "./page"; // Import FormState type

export default async function CategoryServicesList({ categoryId, state }: { categoryId: number; state: FormState }) {
  const categories = await getServiceCategories();
  const currentCategory = categories.find((cat) => cat.id === categoryId);

  if (!currentCategory) {
    notFound();
  }

  const services = await getServices(categoryId);

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
