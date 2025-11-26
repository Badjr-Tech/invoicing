'use server';

import { db } from "@/db";
import { courses, courseLessons, lessonMaterials, externalCourseAccess, users } from "@/db/schema";
import { getSession, SessionPayload } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq, and, asc } from "drizzle-orm";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from 'uuid'; // For generating unique access keys

type FormState = {
  message: string;
  error: string;
  courseId?: number;
} | undefined;

// Helper function to get user ID from session
async function getUserIdFromSession(): Promise<number | undefined> {
  const session: SessionPayload | null = await getSession();
  return session?.user?.id;
}

// --- Course Actions ---

export async function createCourse(prevState: FormState, formData: FormData): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    return { message: "", error: "Course title is required." };
  }

  try {
    const [newCourse] = await db.insert(courses).values({
      creatorId,
      title,
      description,
      status: 'draft',
    }).returning();

    revalidatePath("/dashboard/courses");
    return { message: "Course created successfully as a draft!", error: "", courseId: newCourse.id };
  } catch (error) {
    console.error("Error creating course:", error);
    let errorMessage = "Failed to create course.";
    if (error instanceof Error) {
      errorMessage = `Failed to create course: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function getCreatorCourses(creatorId: number) {
  try {
    const userCourses = await db.query.courses.findMany({
      where: eq(courses.creatorId, creatorId),
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });
    return userCourses;
  } catch (error) {
    console.error("Error fetching creator courses:", error);
    return [];
  }
}

export async function getCourse(courseId: number) {
  try {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)],
          with: {
            materials: true,
          },
        },
        externalAccesses: true,
      },
    });
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export async function updateCourse(prevState: FormState, formData: FormData): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  const courseId = parseInt(formData.get("courseId") as string);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (isNaN(courseId) || !title) {
    return { message: "", error: "Invalid course ID or title missing." };
  }

  try {
    const [updatedCourse] = await db.update(courses)
      .set({ title, description, updatedAt: new Date() })
      .where(and(eq(courses.id, courseId), eq(courses.creatorId, creatorId)))
      .returning();

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "Course updated successfully!", error: "", courseId: updatedCourse.id };
  } catch (error) {
    console.error("Error updating course:", error);
    let errorMessage = "Failed to update course.";
    if (error instanceof Error) {
      errorMessage = `Failed to update course: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function publishCourse(prevState: FormState, courseId: number): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  try {
    const [updatedCourse] = await db.update(courses)
      .set({ status: 'published', updatedAt: new Date() })
      .where(and(eq(courses.id, courseId), eq(courses.creatorId, creatorId)))
      .returning();

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`); // Revalidate public page
    return { message: "Course published successfully!", error: "", courseId: updatedCourse.id };
  } catch (error) {
    console.error("Error publishing course:", error);
    let errorMessage = "Failed to publish course.";
    if (error instanceof Error) {
      errorMessage = `Failed to publish course: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function unpublishCourse(prevState: FormState, courseId: number): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  try {
    const [updatedCourse] = await db.update(courses)
      .set({ status: 'draft', updatedAt: new Date() })
      .where(and(eq(courses.id, courseId), eq(courses.creatorId, creatorId)))
      .returning();

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`); // Revalidate public page
    return { message: "Course unpublished successfully!", error: "", courseId: updatedCourse.id };
  } catch (error) {
    console.error("Error unpublishing course:", error);
    let errorMessage = "Failed to unpublish course.";
    if (error instanceof Error) {
      errorMessage = `Failed to unpublish course: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function addLesson(prevState: FormState, formData: FormData): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  const courseId = parseInt(formData.get("courseId") as string);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const order = parseInt(formData.get("order") as string);

  if (isNaN(courseId) || !title || isNaN(order)) {
    return { message: "", error: "Invalid course ID, title, or order missing." };
  }

  try {
    const [newLesson] = await db.insert(courseLessons).values({
      courseId,
      title,
      content,
      videoUrl,
      order,
    }).returning();

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "Lesson added successfully!", error: "", courseId: courseId };
  } catch (error) {
    console.error("Error adding lesson:", error);
    let errorMessage = "Failed to add lesson.";
    if (error instanceof Error) {
      errorMessage = `Failed to add lesson: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function updateLesson(prevState: FormState, formData: FormData): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  const lessonId = parseInt(formData.get("lessonId") as string);
  const courseId = parseInt(formData.get("courseId") as string);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const order = parseInt(formData.get("order") as string);

  if (isNaN(lessonId) || isNaN(courseId) || !title || isNaN(order)) {
    return { message: "", error: "Invalid lesson ID, course ID, title, or order missing." };
  }

  try {
    const [updatedLesson] = await db.update(courseLessons)
      .set({ title, content, videoUrl, order, updatedAt: new Date() })
      .where(and(eq(courseLessons.id, lessonId), eq(courseLessons.courseId, courseId)))
      .returning();

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "Lesson updated successfully!", error: "", courseId: courseId };
  } catch (error) {
    console.error("Error updating lesson:", error);
    let errorMessage = "Failed to update lesson.";
    if (error instanceof Error) {
      errorMessage = `Failed to update lesson: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function deleteLesson(prevState: FormState, payload: { lessonId: number, courseId: number }): Promise<FormState> {
  const { lessonId, courseId } = payload;
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  if (isNaN(lessonId) || isNaN(courseId)) {
    return { message: "", error: "Invalid lesson ID or course ID." };
  }

  try {
    // First delete associated lesson materials
    await db.delete(lessonMaterials).where(eq(lessonMaterials.lessonId, lessonId));

    await db.delete(courseLessons)
      .where(and(eq(courseLessons.id, lessonId), eq(courseLessons.courseId, courseId)));

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "Lesson deleted successfully!", error: "", courseId: courseId };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    let errorMessage = "Failed to delete lesson.";
    if (error instanceof Error) {
      errorMessage = `Failed to delete lesson: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function reorderLessons(prevState: FormState, payload: { courseId: number, lessonOrder: { id: number; order: number }[] }): Promise<FormState> {
  const { courseId, lessonOrder } = payload;
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  if (isNaN(courseId)) {
    return { message: "", error: "Invalid course ID." };
  }

  try {
    for (const { id, order } of lessonOrder) {
      await db.update(courseLessons)
        .set({ order, updatedAt: new Date() })
        .where(and(eq(courseLessons.id, id), eq(courseLessons.courseId, courseId)));
    }

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "Lessons reordered successfully!", error: "", courseId: courseId };
  } catch (error) {
    console.error("Error reordering lessons:", error);
    let errorMessage = "Failed to reorder lessons.";
    if (error instanceof Error) {
      errorMessage = `Failed to reorder lessons: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function uploadPdf(prevState: FormState, formData: FormData): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  const lessonId = parseInt(formData.get("lessonId") as string);
  const courseId = parseInt(formData.get("courseId") as string);
  const pdfFile = formData.get("pdfFile") as File;

  if (isNaN(lessonId) || isNaN(courseId) || !pdfFile || pdfFile.size === 0) {
    return { message: "", error: "Invalid lesson ID, course ID, or PDF file missing." };
  }

  try {
    const uniqueFilename = `${lessonId}-${uuidv4()}-${pdfFile.name}`;
    const blob = await put(uniqueFilename, pdfFile, { access: 'public', addRandomSuffix: false });

    await db.insert(lessonMaterials).values({
      lessonId,
      fileName: pdfFile.name,
      fileUrl: blob.url,
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "PDF uploaded successfully!", error: "", courseId: courseId };
  } catch (error) {
    console.error("Error uploading PDF:", error);
    let errorMessage = "Failed to upload PDF.";
    if (error instanceof Error) {
      errorMessage = `Failed to upload PDF: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function deletePdf(prevState: FormState, payload: { materialId: number, courseId: number }): Promise<FormState> {
  const { materialId, courseId } = payload;
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  if (isNaN(materialId) || isNaN(courseId)) {
    return { message: "", error: "Invalid material ID or course ID." };
  }

  try {
    // Optionally, delete the blob from Vercel Blob storage here if needed
    // const material = await db.query.lessonMaterials.findFirst({ where: eq(lessonMaterials.id, materialId) });
    // if (material?.fileUrl) {
    //   await del(material.fileUrl);
    // }

    await db.delete(lessonMaterials).where(eq(lessonMaterials.id, materialId));

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "PDF deleted successfully!", error: "", courseId: courseId };
  } catch (error) {
    console.error("Error deleting PDF:", error);
    let errorMessage = "Failed to delete PDF.";
    if (error instanceof Error) {
      errorMessage = `Failed to delete PDF: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function addExternalUserAccess(prevState: FormState, formData: FormData): Promise<FormState> {
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  const courseId = parseInt(formData.get("courseId") as string);
  const externalUserEmail = formData.get("externalUserEmail") as string;
  const accessKey = uuidv4(); // Generate a unique access key

  if (isNaN(courseId) || !externalUserEmail) {
    return { message: "", error: "Invalid course ID or external user email missing." };
  }

  try {
    const [newAccess] = await db.insert(externalCourseAccess).values({
      courseId,
      externalUserId: externalUserEmail, // Using email as unique ID for now
      accessKey,
    }).returning();

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: `Access granted to ${externalUserEmail} with key: ${accessKey}`, error: "", courseId: courseId };
  } catch (error) {
    console.error("Error adding external user access:", error);
    let errorMessage = "Failed to add external user access.";
    if (error instanceof Error) {
      errorMessage = `Failed to add external user access: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function removeExternalUserAccess(prevState: FormState, payload: { accessId: number, courseId: number }): Promise<FormState> {
  const { accessId, courseId } = payload;
  const creatorId = await getUserIdFromSession();

  if (!creatorId) {
    return { message: "", error: "User not authenticated." };
  }

  if (isNaN(accessId) || isNaN(courseId)) {
    return { message: "", error: "Invalid access ID or course ID." };
  }

  try {
    await db.delete(externalCourseAccess)
      .where(and(eq(externalCourseAccess.id, accessId), eq(externalCourseAccess.courseId, courseId)));

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { message: "External user access removed successfully!", error: "", courseId: courseId };
  } catch (error) {
    console.error("Error removing external user access:", error);
    let errorMessage = "Failed to remove external user access.";
    if (error instanceof Error) {
      errorMessage = `Failed to remove external user access: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

// Public access to course (without internal login)
export async function getPublicCourse(courseId: number, accessKey: string) {
  try {
    const course = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.status, 'published')),
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)],
          with: {
            materials: true,
          },
        },
        externalAccesses: {
          where: and(eq(externalCourseAccess.courseId, courseId), eq(externalCourseAccess.accessKey, accessKey)),
        },
      },
    });

    // Check if external user has access
    if (!course || course.externalAccesses.length === 0) {
      return null;
    }

    // Remove sensitive data before returning
    const { externalAccesses, ...publicCourse } = course;
    return publicCourse;

  } catch (error) {
    console.error("Error fetching public course:", error);
    return null;
  }
}