"use client";

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { Laptop } from 'lucide-react';
import { addProduct } from '@/app/dashboard/products/actions';
import { useRouter } from 'next/navigation';

const initialState = {
  message: "",
  error: "",
};

export default function Product34Page() {
  const [state, formAction] = useFormState(addProduct, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      router.push('/dashboard/products');
    }
  }, [state, router]);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center mb-6">
        <Laptop size={48} className="text-red-600" />
        <h1 className="text-4xl font-bold text-gray-800 ml-4">Product 3.4</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product 3.4</h2>
        <p className="text-lg text-gray-600 mb-6">
          This is a preview of Product 3.4. Add this product to your account to start using it.
        </p>
        <form action={formAction}>
          <input type="hidden" name="productId" value="product-3-4" />
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Product
          </button>
          {state.message && <p className="text-green-600 mt-2">{state.message}</p>}
          {state.error && <p className="text-red-600 mt-2">{state.error}</p>}
        </form>
      </div>
    </div>
  );
}
