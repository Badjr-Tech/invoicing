"use client";

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { Brush } from 'lucide-react';
import { addProduct } from '@/app/dashboard/products/actions';
import { useRouter } from 'next/navigation';

const initialState = {
  message: "",
  error: "",
};

export default function PortfolioPage() {
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
        <Brush size={48} className="text-sage-700" />
        <h1 className="font-display text-3xl font-semibold text-clay-800 ml-4">Portfolio Product</h1>
      </div>
      <div className="bg-white p-6 rounded-card shadow-card">
        <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">Portfolio Product</h2>
        <p className="text-lg text-clay-600 mb-6">
          This is a preview of the Portfolio product. Add this product to your account to start using it.
        </p>
        <form action={formAction}>
          <input type="hidden" name="productId" value="portfolio" />
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Product
          </button>
          {state.message && <p className="text-sage-700 mt-2">{state.message}</p>}
          {state.error && <p className="text-red-600 mt-2">{state.error}</p>}
        </form>
      </div>
    </div>
  );
}
