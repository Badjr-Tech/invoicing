import { Package, Shirt, Car, Laptop, Book, AppWindow, AtSign, Brush, LaptopMinimal, BadgeCheck, BookMarked, CalendarCheck2, CalendarClock, Combine, CopyPlus, BadgePlus } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Add a Product</h1>
      <div className="space-y-6"> {/* Categories stacked vertically */}
        {/* Example Category 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">internal: business branding</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-flow-col auto-cols-[10rem] gap-4"> {/* Products horizontally in a grid */}
              <Link href="/dashboard/products/website">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center p-4">
                  <AppWindow size={48} />
                  <span className="mt-2">Website</span>
                </button>
              </Link>
              <Link href="/dashboard/products/email">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center p-4">
                  <AtSign size={48} />
                  <span className="mt-2">Email</span>
                </button>
              </Link>
              <Link href="/dashboard/products/portfolio">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center p-4">
                  <Brush size={48} />
                  <span className="mt-2">Portfolio</span>
                </button>
              </Link>
              <Link href="/dashboard/products/product-1-4">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center p-4">
                  <Laptop size={48} />
                  <span className="mt-2">Product 1.4</span>
                </button>
              </Link>
              <Link href="/dashboard/products/product-1-5">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center p-4">
                  <Book size={48} />
                  <span className="mt-2">Product 1.5</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Example Category 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Expertise</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-flow-col auto-cols-[10rem] gap-4"> {/* Products horizontally in a grid */}
              <Link href="/dashboard/courses/create">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center p-4">
                  <div className="relative">
                    <LaptopMinimal size={48} />
                    <BadgeCheck size={24} className="absolute -top-2 -right-2 text-white bg-green-600 rounded-full" />
                  </div>
                  <span className="mt-2">Course</span>
                </button>
              </Link>
              <Link href="/dashboard/products/library">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center p-4">
                  <BookMarked size={48} />
                  <span className="mt-2">Library</span>
                </button>
              </Link>
              <Link href="/dashboard/products/book-a-call">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center p-4">
                  <CalendarCheck2 size={48} />
                  <span className="mt-2">Book a call</span>
                </button>
              </Link>
              <Link href="/dashboard/products/custom">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center p-4">
                  <BadgePlus size={48} />
                  <span className="mt-2">Custom</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Example Category 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-flow-col auto-cols-[10rem] gap-4"> {/* Products horizontally in a grid */}
              <Link href="/dashboard/products/book-me">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center p-4">
                  <CalendarClock size={48} />
                  <span className="mt-2">Book Me</span>
                </button>
              </Link>
              <Link href="/dashboard/products/deliverables">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center p-4">
                  <Combine size={48} />
                  <span className="mt-2">Deliverables</span>
                </button>
              </Link>
              <Link href="/dashboard/products/campaign">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center p-4">
                  <CopyPlus size={48} />
                  <span className="mt-2">Campaign</span>
                </button>
              </Link>
              <Link href="/dashboard/products/product-3-4">
                <button className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center p-4">
                  <Laptop size={48} />
                  <span className="mt-2">Product 3.4</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
