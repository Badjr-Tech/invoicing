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
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSqtpjh5bhqfVtMK7Oo6kTMfEVs-IgwZhyq1ts898jDVN-P5pqvBqNyKPw5qp3ojkpRQtIDkDXpkkOJ/pubhtml?widget=true&amp;headers=false"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}