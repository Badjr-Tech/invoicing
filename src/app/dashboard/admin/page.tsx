import Link from 'next/link';

export default function AdminToolsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/admin/businesses/manage" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex flex-col items-center justify-center text-center">
          Business Search
        </Link>
        <Link href="/dashboard/admin/users" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex flex-col items-center justify-center text-center">
          Admin Users
        </Link>
        <Link href="/dashboard/admin/agency-class" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center">
          Admin AGENCY Class
        </Link>
        <Link href="/dashboard/admin/records" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 flex flex-col items-center justify-center text-center">
          Admin Records
        </Link>
      </div>
    </div>
  );
}
