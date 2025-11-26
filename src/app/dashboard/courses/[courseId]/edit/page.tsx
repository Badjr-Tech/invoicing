import { getSession } from "@/app/login/actions";
import { getCourse } from "../../actions";
import { redirect } from "next/navigation";
import CourseBuilderClientPage from "./CourseBuilderClientPage";

export default async function EditCoursePage({
  params,
  searchParams,
}: any) {
  const session = await getSession();
  const creatorId = session?.user?.id;

  if (!creatorId) {
    redirect("/login");
  }

  const courseId = parseInt(params.courseId);
  if (isNaN(courseId)) {
    return <p className="p-6 text-red-500">Invalid Course ID.</p>;
  }

  const course = await getCourse(courseId);

  if (!course || course.creatorId !== creatorId) {
    return <p className="p-6 text-red-500">Course not found or you do not have permission to edit it.</p>;
  }

  return (
    <CourseBuilderClientPage initialCourse={course} currentUserId={creatorId} />
  );
}