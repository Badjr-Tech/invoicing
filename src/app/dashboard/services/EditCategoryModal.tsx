"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormState } from 'react-dom';
import { updateServiceCategory } from './categories/actions'; // Assuming updateServiceCategory action will be created
import { ServiceCategory } from '@/db/schema'; // Assuming ServiceCategory type is available from schema

export type FormState = {
  message: string;
  error: string;
} | undefined;

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: ServiceCategory | null;
}) {
  const [state, formAction] = useFormState<FormState, FormData>(updateServiceCategory, undefined);
  const [currentCategory, setCurrentCategory] = useState<ServiceCategory | null>(category);

  useEffect(() => {
    setCurrentCategory(category);
  }, [category]);

  useEffect(() => {
    if (state?.message === "Service category updated successfully!") {
      onClose(); // Close modal on successful update
    }
  }, [state, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentCategory) {
      setCurrentCategory({
        ...currentCategory,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (!currentCategory) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Edit Service Category
                </Dialog.Title>
                <div className="mt-2">
                  <form action={formAction} className="space-y-4">
                    <input type="hidden" name="id" value={currentCategory.id} />
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={currentCategory.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="customId" className="block text-sm font-medium text-gray-700">
                        Custom ID (Optional)
                      </label>
                      <input
                        type="text"
                        name="customId"
                        id="customId"
                        value={currentCategory.customId || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={currentCategory.description || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>

                    {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
                    {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      >
                        Update Category
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
