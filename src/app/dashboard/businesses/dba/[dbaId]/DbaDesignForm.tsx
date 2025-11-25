"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { Dba } from "@/db/schema";
import { updateDbaDesign } from "../../actions";
import Image from "next/image";

export type FormState = {
  message: string;
  error: string;
  success?: boolean;
  updatedDba?: Dba;
} | undefined;

export default function DbaDesignForm({ dba }: { dba: Dba }) {
  const [state, formAction] = useFormState<FormState, FormData>(updateDbaDesign, undefined);
  const [currentDba, setCurrentDba] = useState<Dba>(dba); // State to hold DBA data
  const [color1, setColor1] = useState(currentDba.color1 || '');
  const [color2, setColor2] = useState(currentDba.color2 || '');
  const [color3, setColor3] = useState(currentDba.color3 || '');
  const [color4, setColor4] = useState(currentDba.color4 || '');

  useEffect(() => {
    if (state?.success && state.updatedDba) {
      setCurrentDba(state.updatedDba); // Update local state with the new DBA data
    }
  }, [state]);

  const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex) || hex === '';

  return (
    <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <input type="hidden" name="dbaId" value={currentDba.id} />

      <h3 className="text-lg font-medium leading-6 text-gray-900">DBA Color Scheme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color 1 */}
        <div>
          <label htmlFor="color1" className="block text-sm font-medium text-gray-700">
            Color 1 (Hex Code)
          </label>
          <input
            type="text"
            name="color1"
            id="color1"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isValidHex(color1) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color1) && color1 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color1) && color1 !== '' && (
            <div className="h-12 w-12 rounded-full border border-gray-300" style={{ backgroundColor: color1 }}></div>
          )}
        </div>
        {/* Color 2 */}
        <div>
          <label htmlFor="color2" className="block text-sm font-medium text-gray-700">
            Color 2 (Hex Code)
          </label>
          <input
            type="text"
            name="color2"
            id="color2"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isValidHex(color2) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color2) && color2 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color2) && color2 !== '' && (
            <div className="h-12 w-12 rounded-full border border-gray-300" style={{ backgroundColor: color2 }}></div>
          )}
        </div>
        {/* Color 3 */}
        <div>
          <label htmlFor="color3" className="block text-sm font-medium text-gray-700">
            Color 3 (Hex Code)
          </label>
          <input
            type="text"
            name="color3"
            id="color3"
            value={color3}
            onChange={(e) => setColor3(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isValidHex(color3) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color3) && color3 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color3) && color3 !== '' && (
            <div className="h-12 w-12 rounded-full border border-gray-300" style={{ backgroundColor: color3 }}></div>
          )}
        </div>
        {/* Color 4 */}
        <div>
          <label htmlFor="color4" className="block text-sm font-medium text-gray-700">
            Color 4 (Hex Code)
          </label>
          <input
            type="text"
            name="color4"
            id="color4"
            value={color4}
            onChange={(e) => setColor4(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isValidHex(color4) ? 'border-red-500' : ''}`}
            placeholder="#RRGGBB"
          />
          {!isValidHex(color4) && color4 !== '' && <p className="text-red-500 text-xs mt-1">Invalid Hex code</p>}
        </div>
        <div className="flex items-center justify-center">
          {isValidHex(color4) && color4 !== '' && (
            <div className="h-12 w-12 rounded-full border border-gray-300" style={{ backgroundColor: color4 }}></div>
          )}
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
          DBA Logo
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            id="logo"
            name="logo"
            type="file"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-600
              hover:file:bg-indigo-100"
          />
          {currentDba.logoUrl && (
            <Image src={currentDba.logoUrl} alt="DBA Logo" width={80} height={80} className="h-20 w-20 rounded-full object-cover" />
          )}
        </div>
      </div>

      {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div className="mt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Design
        </button>
      </div>
    </form>
  );
}
