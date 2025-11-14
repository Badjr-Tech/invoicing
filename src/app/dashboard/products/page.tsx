export default function ProductsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Add a Product</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Reverted to grid layout */}
        {/* Example Category 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Removed w-full from here */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category 1</h2>
          <div className="space-y-4">
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center text-center">
              Product 1.1
            </button>
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center text-center">
              Product 1.2
            </button>
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center text-center">
              Product 1.3
            </button>
          </div>
        </div>

        {/* Example Category 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Removed w-full from here */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category 2</h2>
          <div className="space-y-4">
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center text-center">
              Product 2.1
            </button>
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center text-center">
              Product 2.2
            </button>
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center text-center">
              Product 2.3
            </button>
          </div>
        </div>

        {/* Example Category 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Removed w-full from here */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category 3</h2>
          <div className="space-y-4">
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center text-center">
              Product 3.1
            </button>
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center text-center">
              Product 3.2
            </button>
            <button className="w-full aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center text-center">
              Product 3.3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
