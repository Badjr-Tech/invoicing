import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="font-display text-3xl font-semibold text-clay-800 mb-6">Admin Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/admin/businesses/manage" className="aspect-square border border-transparent rounded-control shadow-sm text-lg font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300 flex flex-col items-center justify-center text-center">
          Business Search
        </Link>
        <Link href="/dashboard/admin/users" className="aspect-square border border-transparent rounded-control shadow-sm text-lg font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300 flex flex-col items-center justify-center text-center">
          Admin Users
        </Link>
        <Link href="/dashboard/admin/agency-class" className="aspect-square border border-transparent rounded-control shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex flex-col items-center justify-center text-center">
          Admin AGENCY Class
        </Link>
        <Link href="/dashboard/admin/records" className="aspect-square border border-transparent rounded-control shadow-sm text-lg font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 flex flex-col items-center justify-center text-center">
          Admin Records
        </Link>
      </div>
    </div>
  );
}