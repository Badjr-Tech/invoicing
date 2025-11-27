"use client";

import { useState } from "react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string; // e.g., ".xlsx,.xls"
  buttonText?: string;
  descriptionText?: string;
}

export default function FileUpload({
  onFileUpload,
  acceptedFileTypes = ".xlsx,.xls",
  buttonText = "Upload File",
  descriptionText = "Accepted formats: .xlsx, .xls",
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (acceptedFileTypes && !acceptedFileTypes.split(',').some(type => file.name.endsWith(type))) {
        setError(`Invalid file type. Accepted types: ${acceptedFileTypes}`);
        setFileName(null);
        return;
      }
      setError(null);
      setFileName(file.name);
      onFileUpload(file);
    } else {
      setFileName(null);
      setError(null);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-upload"
        className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 cursor-pointer"
      >
        {buttonText}
      </label>
      {fileName && <p className="mt-2 text-gray-700">Selected file: {fileName}</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {descriptionText && <p className="text-sm text-gray-500 mt-2">{descriptionText}</p>}
    </div>
  );
}
