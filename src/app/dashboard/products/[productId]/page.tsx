export default function ProductDescriptionPage({ params }: { params: { productId: string } }) {
  const { productId } = params;

  // In a real app, you would fetch the product details based on the productId
  const productName = productId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{productName}</h1>
        <button className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add Product
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">This is a placeholder for the product description.</p>
      </div>
    </div>
  );
}
