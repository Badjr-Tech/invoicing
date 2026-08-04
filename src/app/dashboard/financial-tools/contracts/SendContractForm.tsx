"use client";

import { useFormState } from "react-dom";
import { sendContract } from "./actions";
import { ClientWithBusiness } from "@/db/schema";

type FormState = {
  message: string;
  error: string;
} | undefined;

interface SendContractFormProps {
  clients: ClientWithBusiness[];
}

export default function SendContractForm({ clients }: SendContractFormProps) {
  const [state, formAction] = useFormState<FormState, FormData>(sendContract, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="clientEmail" className="block text-sm font-medium text-clay-700">
          Client
        </label>
        <select
          id="clientEmail"
          name="clientEmail"
          required
          className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.email}>
              {client.name} ({client.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contract" className="block text-sm font-medium text-clay-700">
          Contract (PDF)
        </label>
        <input
          type="file"
          id="contract"
          name="contract"
          required
          accept=".pdf"
          className="mt-1 block w-full text-sm text-clay-500 file:mr-4 file:py-2 file:px-4 file:rounded-control file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-clay-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>

      {state?.message && <p className="text-sage-700 text-sm">{state.message}</p>}
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Send Contract
      </button>
    </form>
  );
}
