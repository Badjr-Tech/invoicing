"use client";

import { useState } from "react";
import FileUpload from "./FileUpload"; // Assuming FileUpload is in the same directory

export default function BudgetFileUploadClient() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadStatus("Uploading...");
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-budget', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        setUploadStatus('File uploaded successfully!');
        // TODO: Handle successful upload, e.g., redirect to display page
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        setUploadStatus(null);
        setUploadError(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      setUploadStatus(null);
      setUploadError('Error during file upload.');
    }
  };

  return (
    <div>
      <FileUpload
        onFileUpload={handleFileUpload}
        buttonText="Upload Your Budget File"
        descriptionText="Accepted formats: .xlsx, .xls"
      />
      {uploadStatus && <p className="mt-2 text-green-600">{uploadStatus}</p>}
      {uploadError && <p className="mt-2 text-red-500">{uploadError}</p>}
    </div>
  );
}
