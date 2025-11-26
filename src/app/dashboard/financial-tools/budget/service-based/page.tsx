export default function ServiceBasedBudgetCreationPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Service-Based Budget</h1>
      <p className="mb-4">
        This is an embedded Google Drive document. To embed your own Google Sheet, please follow these steps:
      </p>
      <ol className="list-decimal list-inside mb-6">
        <li>Open your Google Sheet.</li>
        <li>Click on `File` {'>'} `Share` {'>'} `Publish to web`.</li>
        <li>In the `Embed` tab, click `Publish`.</li>
        <li>Copy the `src` attribute from the iframe code and replace the placeholder below.</li>
      </ol>
      <div className="mb-6">
        <p className="text-lg text-gray-700">
          To get your own editable copy of the Service-Based Budget Spreadsheet, click the link below:
        </p>
        <a
          href="https://docs.google.com/spreadsheets/d/1BZt7YpQjokWzTiy5e4K3C-JpgepTRMx4PDtieVT2Y3Y/copy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Copy Service-Based Budget Spreadsheet
        </a>
      </div>
    </div>
  );
}