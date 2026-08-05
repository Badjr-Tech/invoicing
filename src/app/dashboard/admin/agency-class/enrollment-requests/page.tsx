import React from 'react';
import { getPendingEnrollments, acceptEnrollment, rejectEnrollment } from '../actions';
import { revalidatePath } from 'next/cache';

export default async function EnrollmentRequestsPage() {
  const pendingRequests = await getPendingEnrollments();

  async function handleAccept(enrollmentId: number) {
    'use server';
    await acceptEnrollment(enrollmentId);
    revalidatePath('/dashboard/admin/agency-class/enrollment-requests');
  }

  async function handleReject(enrollmentId: number) {
    'use server';
    await rejectEnrollment(enrollmentId);
    revalidatePath('/dashboard/admin/agency-class/enrollment-requests');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="font-display text-2xl font-semibold mb-6">Enrollment Requests</h1>

      {pendingRequests.length === 0 ? (
        <p>No pending enrollment requests.</p>
      ) : (
        <ul className="space-y-4">
          {pendingRequests.map((request) => (
            <li key={request.id} className="bg-clay-50 shadow overflow-hidden rounded-control px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-clay-800">User: {request.user?.name} ({request.user?.email})</p>
                  <p className="text-sm text-clay-500">Class: {request.class?.title}</p>
                  <p className="text-sm text-clay-500">Requested on: {new Date(request.enrollmentDate).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <form action={() => handleAccept(request.id)}>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
                    >
                      Accept
                    </button>
                  </form>
                  <form action={() => handleReject(request.id)}>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}