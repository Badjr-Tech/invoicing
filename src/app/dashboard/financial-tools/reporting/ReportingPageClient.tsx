"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { generatePdf } from "../actions";

type FormState = {
  message: string;
  error: string;
  pdfData?: string;
} | undefined;

export default function ReportingPageClient() {
  const [state, formAction] = useFormState<FormState, FormData>(generatePdf, undefined);

  useEffect(() => {
    if (state?.pdfData) {
      const byteCharacters = atob(state.pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [state]);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Reporting</h1>
      <p className="text-gray-700">This page will allow you to generate various financial reports.</p>
      
      <form action={formAction}>
        <button
          type="submit"
          className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Generate PDF Report
        </button>
      </form>

      {state?.error && <p className="text-red-500 mt-4">{state.error}</p>}
    </div>
  );
}