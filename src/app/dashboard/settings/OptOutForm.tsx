'use client';

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { optOutUser } from "./actions";

const initialState: { message: string; error: string } | undefined = undefined;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 bg-red-600 text-white rounded-control hover:bg-red-700 disabled:bg-red-300"
    >
      {pending ? "Submitting..." : "Confirm and Opt Out"}
    </button>
  );
}

export default function OptOutForm({ userName, isOptedOut: initialIsOptedOut }: { userName: string, isOptedOut: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, formAction] = useFormState(optOutUser, initialState);
  const [isOptedOut, setIsOptedOut] = useState(initialIsOptedOut);
  const [name, setName] = useState("");

  useEffect(() => {
    if (state?.message && !state.error) {
      setIsOptedOut(true);
      setIsModalOpen(false);
    }
  }, [state]);

  if (isOptedOut) {
    return (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-bold">You have opted out</p>
        <p>You will no longer receive business communications, including funding alerts, business resources, notes, and pitch alerts.</p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-gray-200 text-clay-800 rounded-control hover:bg-gray-300"
      >
        Opt Out of Communications
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-clay-50 p-8 rounded-card shadow-2xl max-w-md w-full">
            <h2 className="font-display text-xl font-semibold mb-4">Confirm Opt-Out</h2>
            <p className="mb-4 text-clay-600">
              Please confirm that you wish to no longer receive any business communications, including funding alerts, business resources, notes, and pitch alerts.
            </p>
            <p className="mb-6 text-clay-600">
              To complete this action, please type your full name (<span className="font-mono bg-clay-100 p-1 rounded">{userName}</span>) in the box below.
            </p>
            
            <form action={formAction}>
              <div className="mb-4">
<label htmlFor="name" className="block text-sm font-medium text-clay-800">
              Your Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-light-gray rounded-control shadow-sm focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
              />
            </div>
          </div>
          {state?.error && <p className="text-red-500 text-sm mb-4">{state.error}</p>}
          {state?.message && !state.error && <p className="text-green-500 text-sm mb-4">{state.message}</p>}

              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-clay-600"
                >
                  Cancel
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
