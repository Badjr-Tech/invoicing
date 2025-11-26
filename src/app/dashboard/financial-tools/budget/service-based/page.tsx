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
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1BZt7YpQjokWzTiy5e4K3C-JpgepTRMx4PDtieVT2Y3Y/copy" // NOTE: This might not display correctly if it's not a "publish to web" link.
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}