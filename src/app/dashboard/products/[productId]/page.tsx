"use client";

import { useFormState } from "react-dom";
import { addProduct } from "../actions";
import { useEffect } from "react";

type FormState = {
  message: string;
  error: string;
} | undefined;

type PagePropsWithPromiseParams = {
  params: { productId: string } & Promise<any>; // Combine with Promise<any> to satisfy the compiler
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ProductDescriptionPage({
  params,
  searchParams,
}: PagePropsWithPromiseParams) {
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
        <h1 className="text-4xl font-bold text-gray-800">{productName}</h1>
        <form action={formAction}>
          <input type="hidden" name="productId" value={productId} />
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Product
          </button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">This is a placeholder for the product description.</p>
      </div>
    </div>
  );
}
