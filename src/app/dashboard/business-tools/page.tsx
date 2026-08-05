import Link from 'next/link';

export default function BusinessToolsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="font-display text-3xl font-semibold text-clay-800 mb-6">Business Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/messages" className="aspect-square border border-transparent rounded-control shadow-sm text-lg font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300 flex flex-col items-center justify-center text-center">
          Messages
        </Link>
        <Link href="/dashboard/businesses" className="aspect-square border border-transparent rounded-control shadow-sm text-lg font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300 flex flex-col items-center justify-center text-center">
          Businesses
        </Link>
        <Link href="/dashboard/products" className="aspect-square border border-transparent rounded-control shadow-sm text-lg font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300 flex flex-col items-center justify-center text-center">
          Products
        </Link>
      </div>
    </div>
  );
}
