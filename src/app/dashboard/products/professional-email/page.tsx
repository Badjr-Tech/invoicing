"use client";

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { MailCheck } from 'lucide-react';
import { addProduct } from '@/app/dashboard/products/actions';
import { useRouter } from 'next/navigation';

const initialState = {
  message: "",
  error: "",
};

export default function ProfessionalEmailPage() {
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
        <MailCheck size={48} className="text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800 ml-4">Professional Email Product</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Establish Your Professional Presence</h2>
        <p className="text-lg text-gray-600 mb-6">
          Get a professional email address that matches your business domain (e.g., yourname@yourbusiness.com). This product helps you build credibility, enhance your brand image, and manage your communications effectively.
        </p>
        <form action={formAction}>
          <input type="hidden" name="productId" value="professional-email" />
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
