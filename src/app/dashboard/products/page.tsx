import { Package, Shirt, Car, Laptop, Book, AppWindow, AtSign, Brush, LaptopMinimal, BadgeCheck, BookMarked, CalendarCheck2, CalendarClock, Combine, CopyPlus, BadgePlus } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Add a Product</h1>
      <div className="space-y-6"> {/* Categories stacked vertically */}
        {/* Example Category 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">internal: business branding</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Products horizontally in a grid */}
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center">
              <AppWindow size={48} />
              <span className="mt-2">Website</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center">
              <AtSign size={48} />
              <span className="mt-2">Email</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center">
              <Brush size={48} />
              <span className="mt-2">Portfolio</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center">
              <Laptop size={48} />
              <span className="mt-2">Product 1.4</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center">
              <Book size={48} />
              <span className="mt-2">Product 1.5</span>
            </button>
          </div>
        </div>

        {/* Example Category 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Products horizontally in a grid */}
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center">
              <div className="relative">
                <LaptopMinimal size={48} />
                <BadgeCheck size={24} className="absolute -top-2 -right-2 text-white bg-green-600 rounded-full" />
              </div>
              <span className="mt-2">Course</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center">
              <BookMarked size={48} />
              <span className="mt-2">Library</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center">
              <CalendarCheck2 size={48} />
              <span className="mt-2">Book a call</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center">
              <BadgePlus size={48} />
              <span className="mt-2">Custom</span>
            </button>
          </div>
        </div>

        {/* Example Category 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Products horizontally in a grid */}
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center">
              <CalendarClock size={48} />
              <span className="mt-2">Book Me</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center">
              <Combine size={48} />
              <span className="mt-2">Deliverables</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center">
              <CopyPlus size={48} />
              <span className="mt-2">Campaign</span>
            </button>
            <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center">
              <Laptop size={48} />
              <span className="mt-2">Product 3.4</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
