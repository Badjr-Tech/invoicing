import { getServiceCategories } from "./categories/actions";
import Link from "next/link";
// import { FormState } from "./page"; // No longer needed

export default async function ServiceCategoriesList() { // Removed state prop
  const categories = await getServiceCategories();

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
              {/* Add edit/delete buttons here later */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
