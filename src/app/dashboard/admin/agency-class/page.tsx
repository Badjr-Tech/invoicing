import React from 'react';
import Link from 'next/link';
import { getAllClasses } from './actions'; // Adjust path as needed

export default async function AdminAGENCYClassPage() {
  const allClasses = await getAllClasses();
  const preCourseClasses = allClasses.filter(cls => cls.type === 'pre-course');
  const agencyCourseClasses = allClasses.filter(cls => cls.type === 'agency-course');

  return (
    <div className="container mx-auto p-6">
      <h1 className="font-display text-2xl font-semibold mb-6">AGENCY Class - Admin View (Teacher)</h1>

      <div className="mb-6 flex space-x-4">
        <Link href="/dashboard/admin/agency-class/add-class" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Add New Class
        </Link>
        <Link href="/dashboard/admin/agency-class/enrollment-requests" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300">
          View Enrollment Requests
        </Link>
      </div>

      <h2 className="font-display text-xl font-semibold mb-4">Pre-Course Classes</h2>
      {preCourseClasses.length === 0 ? (
        <p>No Pre-Course classes found. Add a new class to get started.</p>
      ) : (
        <ul className="space-y-4">
          {preCourseClasses.map((classItem) => (
            <li key={classItem.id} className="bg-background shadow overflow-hidden rounded-control px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{classItem.title}</h3>
                  <p className="text-sm text-clay-500">{classItem.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/admin/agency-class/edit-class/${classItem.id}`} className="text-primary hover:text-primary-dark">
                    Edit Class
                  </Link>
                  <Link href={`/dashboard/admin/agency-class/add-lesson?classId=${classItem.id}`} className="text-sage-700 hover:text-green-900">
                    Add Lesson
                  </Link>
                  {/* TODO: Add Delete Class functionality */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="font-display text-xl font-semibold mb-4 mt-8">AGENCY Course Classes</h2>
      {agencyCourseClasses.length === 0 ? (
        <p>No AGENCY Course classes found. Add a new class to get started.</p>
      ) : (
        <ul className="space-y-4">
          {agencyCourseClasses.map((classItem) => (
            <li key={classItem.id} className="bg-background shadow overflow-hidden rounded-control px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{classItem.title}</h3>
                  <p className="text-sm text-clay-500">{classItem.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/admin/agency-class/edit-class/${classItem.id}`} className="text-primary hover:text-primary-dark">
                    Edit Class
                  </Link>
                  <Link href={`/dashboard/admin/agency-class/add-lesson?classId=${classItem.id}`} className="text-sage-700 hover:text-green-900">
                    Add Lesson
                  </Link>
                  {/* TODO: Add Delete Class functionality */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}