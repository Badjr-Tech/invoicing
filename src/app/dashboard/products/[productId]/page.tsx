"use client";

import { useFormState } from "react-dom";
import { addProduct } from "../actions";
import { useEffect } from "react";

type FormState = {
  message: string;
  error: string;
} | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductDescriptionPage({
  params,
  searchParams,
}: any) {
  const { productId } = params;
  const [state, formAction] = useFormState<FormState, FormData>(addProduct, undefined);

  // In a real app, you would fetch the product details based on the productId
  const productName = productId.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

  useEffect(() => {
    if (state?.message) {
      alert(state.message);
    } else if (state?.error) {
      alert(state.error);
    }
  }, [state]);

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-semibold text-clay-800">{productName}</h1>
        <form action={formAction}>
          <input type="hidden" name="productId" value={productId} />
          <button
            type="submit"
            className="inline-flex justify-center rounded-control border border-transparent bg-ember-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2"
          >
            Add Product
          </button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-card shadow-card">
        <p className="text-clay-700">This is a placeholder for the product description.</p>
      </div>
    </div>
  );
}
