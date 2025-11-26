import { getSession } from "@/app/login/actions";
import { getCreatorCourses } from "./actions";
import Link from "next/link";

export default async function CoursesPage() {
  const session = await getSession();
  const creatorId = session?.user?.id;

  if (!creatorId) {
    return <p className="p-6 text-red-500">You must be logged in to view courses.</p>;
  }

  const courses = await getCreatorCourses(creatorId);

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your Courses</h1>
        <Link
          href="/dashboard/courses/create"
          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-foreground">You haven&apos;t created any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-4">{course.description || "No description provided."}</p>
              <p className="text-sm text-gray-500 mb-4">Status: <span className={`font-semibold ${course.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>{course.status}</span></p>
              <div className="flex space-x-4">
                <Link
                  href={`/dashboard/courses/${course.id}/edit`}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Edit Course
                </Link>
                {course.status === 'published' && (
                  <Link
                    href={`/courses/${course.id}`} // Public URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    View Public Page
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}