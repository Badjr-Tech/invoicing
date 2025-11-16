"use client";

import { useState, useEffect } from "react";
import { DBA } from "@/db/schema";
import { useFormState } from "react-dom";
import { createDBA, updateDBA } from "../../actions";

interface AddEditDbaFormProps {
  businessId: number;
  dbaToEdit?: DBA | null;
  onSave: (dba: DBA) => void;
  onCancel: () => void;
}

export default function AddEditDbaForm({ businessId, dbaToEdit, onSave, onCancel }: AddEditDbaFormProps) {
  const isEditing = !!dbaToEdit;
  const [dbaName, setDbaName] = useState(dbaToEdit?.dbaName || "");
  const [legalBusinessName, setLegalBusinessName] = useState(dbaToEdit?.legalBusinessName || "");
  const [isPrimary, setIsPrimary] = useState(dbaToEdit?.isPrimary || false);

  const [state, formAction] = useFormState(isEditing ? updateDBA : createDBA, undefined);

  useEffect(() => {
    if (state?.message && !state.error && state.updatedDba) {
      onSave(state.updatedDba as DBA);
    }
  }, [state?.updatedDba, onSave, state?.message, state?.error]);

  return (
    <form action={formAction} className="mt-4 p-4 border border-gray-200 rounded-md space-y-4 bg-gray-50">
      <input type="hidden" name="businessId" value={businessId} />
      {isEditing && <input type="hidden" name="dbaId" value={dbaToEdit?.id} />}

      <div>
        <label htmlFor="dbaName" className="block text-sm font-medium text-gray-700">
          DBA Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="dbaName"
            name="dbaName"
            value={dbaName}
            onChange={(e) => setDbaName(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="legalBusinessName" className="block text-sm font-medium text-gray-700">
          Legal Business Name (if different from main business)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="legalBusinessName"
            name="legalBusinessName"
            value={legalBusinessName}
            onChange={(e) => setLegalBusinessName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="isPrimary"
          name="isPrimary"
          type="checkbox"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
          Set as Primary DBA
        </label>
      </div>

      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state?.message && !state.error && <p className="mt-2 text-sm text-green-600">{state.message}</p>}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isEditing ? "Update DBA" : "Add DBA"}
        </button>
      </div>
    </form>
  );
}
