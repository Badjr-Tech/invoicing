"use client";

import { useFormState } from "react-dom";
import { Dba } from "@/db/schema";
import { updateDbaDesign } from "../actions";

export default function DbaDesignForm({ dba }: { dba: Dba }) {
  const [state, formAction] = useFormState(updateDbaDesign, { message: "", error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="dbaId" value={dba.id} />
      <div>
        <label htmlFor="color1" className="block text-sm font-medium text-gray-700">
          Color 1
        </label>
        <div className="mt-1">
          <input
            id="color1"
            name="color1"
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={dba.color1 || ""}
          />
        </div>
      </div>
      <div>
        <label htmlFor="color2" className="block text-sm font-medium text-gray-700">
          Color 2
        </label>
        <div className="mt-1">
          <input
            id="color2"
            name="color2"
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={dba.color2 || ""}
          />
        </div>
      </div>
      <div>
        <label htmlFor="color3" className="block text-sm font-medium text-gray-700">
          Color 3
        </label>
        <div className="mt-1">
          <input
            id="color3"
            name="color3"
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={dba.color3 || ""}
          />
        </div>
      </div>
      <div>
        <label htmlFor="color4" className="block text-sm font-medium text-gray-700">
          Color 4
        </label>
        <div className="mt-1">
          <input
            id="color4"
            name="color4"
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={dba.color4 || ""}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
      {state?.message && <p className="text-green-500">{state.message}</p>}
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
