"use client";

import { useFormState } from "react-dom";
import { createCourse } from "../actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type FormState = {
  message: string;
  error: string;
  courseId?: number;
} | undefined;

export default function CreateCoursePage() {
  const [state, formAction] = useFormState<FormState, FormData>(createCourse, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.courseId) {
      router.push(`/dashboard/courses/${state.courseId}/edit`);
    }
  }, [state, router]);

  return (
    <div className="flex-1 p-6">
      <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Create New Course</h1>
      <form action={formAction} className="space-y-6 bg-white p-6 rounded-card shadow-card">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-clay-700">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-clay-700">
            Course Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={5}
            className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        {state?.message && <p className="text-sage-700 text-sm">{state.message}</p>}
        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}