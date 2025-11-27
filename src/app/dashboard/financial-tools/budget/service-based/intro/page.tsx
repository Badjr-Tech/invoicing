import Link from "next/link";

import FileUpload from "@/app/dashboard/components/FileUpload"; // Add import

export default function ServiceBasedBudgetIntroPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Service-Based Budget Calculator</h1>

      {/* Short Description - Placeholder for user input */}
      <p className="text-lg text-gray-700 mb-8">
        This section helps service-based businesses create a comprehensive budget, track financial performance, and calculate profit margins specific to services. Follow the steps below to get started.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works:</h2>

        {/* Step 1: Copy the Template */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Step 1: Get Your Budget Template</h3>
          <p className="text-lg text-gray-700 mb-4">
            Click the button below to get your own editable copy of the Service-Based Budget Spreadsheet template. This will open in a new tab.
          </p>
          <a
            href="https://docs.google.com/spreadsheets/d/1BZt7YpQjokWzTiy5e4K3C-JpgepTRMx4PDtieVT2Y3Y/copy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Copy Budget Template
          </a>
        </div>

        {/* Step 2: Fill it Out */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Step 2: Fill Out Your Spreadsheet</h3>
          <p className="text-lg text-gray-700">
            Open your copied spreadsheet and fill in your income, expenses, and other relevant financial data. Make sure to save your changes.
          </p>
        </div>

        {/* Step 3: Upload for Calculations */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Step 3: Upload for Calculations</h3>
          <p className="text-lg text-gray-700 mb-4">
            Once you've filled out your budget, upload the Excel file below to see your profit calculations and a detailed breakdown.
          </p>
          <FileUpload
            onFileUpload={async (file) => {
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
                  alert('File uploaded successfully!');
                  // TODO: Handle successful upload, e.g., redirect to display page
                } else {
                  const errorData = await response.json();
                  console.error('Upload failed:', errorData);
                  alert(`Upload failed: ${errorData.error}`);
                }
              } catch (error) {
                console.error('Error during file upload:', error);
                alert('Error during file upload.');
              }
            }}
            buttonText="Upload Your Budget File"
            descriptionText="Accepted formats: .xlsx, .xls"
          />
        </div>
      </div>

      {/* How to Price Your Service Button */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Need help pricing your services?</h2>
        <Link href="/dashboard/financial-tools/budget/pricing-tools/service" className="inline-block px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-secondary-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-accent">
          How to Price Your Service
        </Link>
      </div>
      {/* Proceed to Budget Button */}
      <div className="mt-8 text-center">
        <Link href="/dashboard/financial-tools/budget/service-based" className="inline-block px-8 py-4 border border-transparent text-xl font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Proceed to Service-Based Budget
        </Link>
      </div>
    </div>
  );
}