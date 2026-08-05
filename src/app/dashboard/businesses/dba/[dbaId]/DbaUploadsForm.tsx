"use client";

import { useFormState } from "react-dom";
import { Dba } from "@/db/schema";
import { updateDbaUploads } from "../../actions";

export default function DbaUploadsForm({ dba }: { dba: Dba }) {
  const [state, formAction] = useFormState(updateDbaUploads, { message: "", error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="dbaId" value={dba.id} />
      <div>
        <label htmlFor="upload1" className="block text-sm font-medium text-clay-700">
          Upload 1
        </label>
        <div className="mt-1">
          <input
            id="upload1"
            name="upload1"
            type="file"
            className="appearance-none block w-full px-3 py-2 border border-clay-200 rounded-control shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="upload2" className="block text-sm font-medium text-clay-700">
          Upload 2
        </label>
        <div className="mt-1">
          <input
            id="upload2"
            name="upload2"
            type="file"
            className="appearance-none block w-full px-3 py-2 border border-clay-200 rounded-control shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="upload3" className="block text-sm font-medium text-clay-700">
          Upload 3
        </label>
        <div className="mt-1">
          <input
            id="upload3"
            name="upload3"
            type="file"
            className="appearance-none block w-full px-3 py-2 border border-clay-200 rounded-control shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
        >
          Save
        </button>
      </div>
      {state?.message && <p className="text-green-500">{state.message}</p>}
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
