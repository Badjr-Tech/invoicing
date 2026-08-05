"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateBusinessDesign } from "../actions"; // Assuming updateBusinessDesign action will be created
import { Business } from "@/db/schema"; // Import necessary types

export type FormState = {
  message: string;
  error: string;
} | undefined;

interface BusinessDesignFormProps {
  business: Business & { color1?: string | null; color2?: string | null; color3?: string | null; color4?: string | null; };
}

export default function BusinessDesignForm({ business }: BusinessDesignFormProps) {
  const [state, formAction] = useFormState<FormState, FormData>(updateBusinessDesign, undefined);
  const [color1, setColor1] = useState(business.color1 || '');
  const [color2, setColor2] = useState(business.color2 || '');
  const [color3, setColor3] = useState(business.color3 || '');
  const [color4, setColor4] = useState(business.color4 || '');

  useEffect(() => {
    if (state?.message === "Business design updated successfully!") {
      // Optionally, show a success message or revalidate data
    }
  }, [state]);

  const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex) || hex === '';

  return (
    <form action={formAction} className="space-y-6 bg-white p-6 rounded-card shadow-card">
      <input type="hidden" name="businessId" value={business.id} />

      <h3 className="text-lg font-medium leading-6 text-clay-900">Business Color Scheme</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color 1 */}
        <div>
          <label htmlFor="color1" className="block text-sm font-medium text-clay-700">
            Color 1 (Hex Code)
          </label>
          <input
            type="text"
            name="color1"
            id="color1"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className={`mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm ${!isValidHex(color1) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color1) && color1 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color1) && color1 !== '' && (
            <div className="h-12 w-12 rounded-full border border-clay-200" style={{ backgroundColor: color1 }}></div>
          )}
        </div>

        {/* Color 2 */}
        <div>
          <label htmlFor="color2" className="block text-sm font-medium text-clay-700">
            Color 2 (Hex Code)
          </label>
          <input
            type="text"
            name="color2"
            id="color2"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className={`mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm ${!isValidHex(color2) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color2) && color2 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color2) && color2 !== '' && (
            <div className="h-12 w-12 rounded-full border border-clay-200" style={{ backgroundColor: color2 }}></div>
          )}
        </div>

        {/* Color 3 */}
        <div>
          <label htmlFor="color3" className="block text-sm font-medium text-clay-700">
            Color 3 (Hex Code)
          </label>
          <input
            type="text"
            name="color3"
            id="color3"
            value={color3}
            onChange={(e) => setColor3(e.target.value)}
            className={`mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm ${!isValidHex(color3) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color3) && color3 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color3) && color3 !== '' && (
            <div className="h-12 w-12 rounded-full border border-clay-200" style={{ backgroundColor: color3 }}></div>
          )}
        </div>

        {/* Color 4 */}
        <div>
          <label htmlFor="color4" className="block text-sm font-medium text-clay-700">
            Color 4 (Hex Code)
          </label>
          <input
            type="text"
            name="color4"
            id="color4"
            value={color4}
            onChange={(e) => setColor4(e.target.value)}
            className={`mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm ${!isValidHex(color4) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color4) && color4 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color4) && color4 !== '' && (
            <div className="h-12 w-12 rounded-full border border-clay-200" style={{ backgroundColor: color4 }}></div>
          )}
        </div>
      </div>

      {state?.message && <p className="text-sage-700 text-sm">{state.message}</p>}
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div className="mt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
        >
          Save Design
        </button>
      </div>
    </form>
  );
}
