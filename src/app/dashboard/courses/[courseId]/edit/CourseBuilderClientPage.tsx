"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { Course, CourseLesson, LessonMaterial, ExternalCourseAccess } from "@/db/schema";
import { updateCourse, publishCourse, unpublishCourse, addLesson, updateLesson, deleteLesson, reorderLessons, uploadPdf, deletePdf, addExternalUserAccess, removeExternalUserAccess } from "../../actions";
import { useRouter } from "next/navigation";
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import Link from "next/link";

interface CourseBuilderClientPageProps {
  initialCourse: Course & {
    lessons: (CourseLesson & { materials: LessonMaterial[] })[];
    externalAccesses: ExternalCourseAccess[];
  };
  currentUserId: number;
}

type FormState = {
  message: string;
  error: string;
  courseId?: number;
} | undefined;

// Drag and Drop types
// const ItemTypes = {
//   LESSON: 'lesson',
// };

// interface DragItem {
//   index: number;
//   id: number;
//   type: string;
// }

// Lesson component for drag and drop
interface LessonProps {
  lesson: CourseLesson & { materials: LessonMaterial[] };
  index: number;
  // moveLesson: (dragIndex: number, hoverIndex: number) => void; // Commented out
  onUpdate: (lesson: CourseLesson) => void;
  onDelete: (lessonId: number) => void;
  onPdfUpload: (lessonId: number, file: File) => void;
  onPdfDelete: (materialId: number) => void;
  isCoursePublished: boolean;
}

const Lesson: React.FC<LessonProps> = ({ lesson, index, /* moveLesson, */ onUpdate, onDelete, onPdfUpload, onPdfDelete, isCoursePublished }) => {
  const [lessonTitle, setLessonTitle] = useState(lesson.title);
  const [lessonContent, setLessonContent] = useState(lesson.content || '');
  const [lessonVideoUrl, setLessonVideoUrl] = useState(lesson.videoUrl || '');
  // const [pdfFiles, setPdfFiles] = useState<File[]>([]); // This state is not used

  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemTypes.LESSON,
  //   item: { id: lesson.id, index },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // });

  // const [, drop] = useDrop({
  //   accept: ItemTypes.LESSON,
  //   hover(item: DragItem, monitor) {
  //     if (!drag) {
  //       return;
  //     }
  //     const dragIndex = item.index;
  //     const hoverIndex = index;

  //     // Don't replace items with themselves
  //     if (dragIndex === hoverIndex) {
  //       return;
  //     }

  //     // Time to actually perform the action
  //     moveLesson(dragIndex, hoverIndex);

  //     // Note: we're mutating the monitor item here!
  //     // Generally it's better to avoid mutations in render functions,
  //     // but it's good here for the sake of performance to avoid expensive re-renders.
  //     item.index = hoverIndex;
  //   },
  // });

  const handleUpdateLesson = () => {
    onUpdate({ ...lesson, title: lessonTitle, content: lessonContent, videoUrl: lessonVideoUrl });
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // setPdfFiles(filesArray); // This state is not used
      filesArray.forEach(file => onPdfUpload(lesson.id, file));
    }
  };

  // const opacity = isDragging ? 0 : 1;

  return (
    <div /* ref={(node) => drag(drop(node))} style={{ opacity }} */ className="bg-gray-50 p-4 rounded-md shadow-sm mb-4 border border-gray-200">
      <h4 className="text-lg font-semibold mb-2">Lesson {index + 1}</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            onBlur={handleUpdateLesson}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isCoursePublished}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
            onBlur={handleUpdateLesson}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isCoursePublished}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Video URL</label>
          <input
            type="text"
            value={lessonVideoUrl}
            onChange={(e) => setLessonVideoUrl(e.target.value)}
            onBlur={handleUpdateLesson}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            disabled={isCoursePublished}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PDF Uploads</label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handlePdfChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            disabled={isCoursePublished}
          />
          <ul className="mt-2 space-y-1">
            {lesson.materials.map(material => (
              <li key={material.id} className="flex items-center justify-between text-sm text-gray-600">
                <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{material.fileName}</a>
                {!isCoursePublished && (
                  <button onClick={() => onPdfDelete(material.id)} className="ml-2 text-red-600 hover:text-red-800">
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        {!isCoursePublished && (
          <button onClick={() => onDelete(lesson.id)} className="mt-4 text-red-600 hover:text-red-800">
            Delete Lesson
          </button>
        )}
      </div>
    </div>
  );
};


export default function CourseBuilderClientPage({ initialCourse, currentUserId }: CourseBuilderClientPageProps) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [courseTitle, setCourseTitle] = useState(initialCourse.title);
  const [courseDescription, setCourseDescription] = useState(initialCourse.description || '');
  const [lessons, setLessons] = useState(initialCourse.lessons);
  const [externalAccesses, setExternalAccesses] = useState(initialCourse.externalAccesses);
  const [newExternalUserEmail, setNewExternalUserEmail] = useState('');

  const [updateCourseState, updateCourseAction] = useFormState<FormState, FormData>(updateCourse, undefined);
  const [publishCourseState, publishCourseAction] = useFormState<FormState, number>(publishCourse, undefined);
  const [unpublishCourseState, unpublishCourseAction] = useFormState<FormState, number>(unpublishCourse, undefined);
  const [addLessonState, addLessonAction] = useFormState<FormState, FormData>(addLesson, undefined);
  const [updateLessonState, updateLessonAction] = useFormState<FormState, FormData>(updateLesson, undefined);
  const [deleteLessonState, deleteLessonAction] = useFormState<FormState, { lessonId: number, courseId: number }>(deleteLesson, undefined);
  const [reorderLessonsState, reorderLessonsAction] = useFormState<FormState, { courseId: number; lessonOrder: { id: number; order: number }[] }>(reorderLessons, undefined);
  const [uploadPdfState, uploadPdfAction] = useFormState<FormState, FormData>(uploadPdf, undefined);
  const [deletePdfState, deletePdfAction] = useFormState<FormState, { materialId: number, courseId: number }>(deletePdf, undefined);
  const [addExternalAccessState, addExternalAccessAction] = useFormState<FormState, FormData>(addExternalUserAccess, undefined);
  const [removeExternalAccessState, removeExternalAccessAction] = useFormState<FormState, { accessId: number, courseId: number }>(removeExternalUserAccess, undefined);


  const isCoursePublished = course.status === 'published';

  useEffect(() => {
    if (updateCourseState?.message) {
      console.log(updateCourseState.message);
      // Optionally update local state or re-fetch course
    }
    if (updateCourseState?.error) {
      console.error(updateCourseState.error);
    }
  }, [updateCourseState]);

  useEffect(() => {
    if (publishCourseState?.message) {
      setCourse(prev => ({ ...prev, status: 'published' }));
      console.log(publishCourseState.message);
    }
    if (publishCourseState?.error) {
      console.error(publishCourseState.error);
    }
  }, [publishCourseState]);

  useEffect(() => {
    if (unpublishCourseState?.message) {
      setCourse(prev => ({ ...prev, status: 'draft' }));
      console.log(unpublishCourseState.message);
    }
    if (unpublishCourseState?.error) {
      console.error(unpublishCourseState.error);
    }
  }, [unpublishCourseState]);

  useEffect(() => {
    if (addLessonState?.message) {
      // Re-fetch course to get updated lessons with correct order/IDs
      router.refresh();
    }
    if (addLessonState?.error) {
      console.error(addLessonState.error);
    }
  }, [addLessonState, router]);

  useEffect(() => {
    if (updateLessonState?.message) {
      // Re-fetch course to get updated lessons
      router.refresh();
    }
    if (updateLessonState?.error) {
      console.error(updateLessonState.error);
    }
  }, [updateLessonState, router]);

  useEffect(() => {
    if (deleteLessonState?.message) {
      // Re-fetch course to get updated lessons
      router.refresh();
    }
    if (deleteLessonState?.error) {
      console.error(deleteLessonState.error);
    }
  }, [deleteLessonState, router]);

  useEffect(() => {
    if (reorderLessonsState?.message) {
      // Re-fetch course to get updated lessons
      router.refresh();
    }
    if (reorderLessonsState?.error) {
      console.error(reorderLessonsState.error);
    }
  }, [reorderLessonsState, router]);

  useEffect(() => {
    if (uploadPdfState?.message) {
      // Re-fetch course to get updated materials
      router.refresh();
    }
    if (uploadPdfState?.error) {
      console.error(uploadPdfState.error);
    }
  }, [uploadPdfState, router]);

  useEffect(() => {
    if (deletePdfState?.message) {
      // Re-fetch course to get updated materials
      router.refresh();
    }
    if (deletePdfState?.error) {
      console.error(deletePdfState.error);
    }
  }, [deletePdfState, router]);

  useEffect(() => {
    if (addExternalAccessState?.message) {
      // Re-fetch course to get updated external accesses
      router.refresh();
      setNewExternalUserEmail('');
    }
    if (addExternalAccessState?.error) {
      console.error(addExternalAccessState.error);
    }
  }, [addExternalAccessState, router]);

  useEffect(() => {
    if (removeExternalAccessState?.message) {
      // Re-fetch course to get updated external accesses
      router.refresh();
    }
    if (removeExternalAccessState?.error) {
      console.error(removeExternalAccessState.error);
    }
  }, [removeExternalAccessState, router]);


  const handleUpdateCourseDetails = () => {
    const formData = new FormData();
    formData.append('courseId', course.id.toString());
    formData.append('title', courseTitle);
    formData.append('description', courseDescription);
    updateCourseAction(formData);
  };

  const handleAddLesson = async () => {
    const newOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) + 1 : 1;
    const formData = new FormData();
    formData.append('courseId', course.id.toString());
    formData.append('title', `New Lesson ${newOrder}`);
    formData.append('content', '');
    formData.append('videoUrl', '');
    formData.append('order', newOrder.toString());
    addLessonAction(formData);
  };

  const handleUpdateLesson = (updatedLesson: CourseLesson) => {
    const formData = new FormData();
    formData.append('lessonId', updatedLesson.id.toString());
    formData.append('courseId', course.id.toString());
    formData.append('title', updatedLesson.title);
    formData.append('content', updatedLesson.content || '');
    formData.append('videoUrl', updatedLesson.videoUrl || '');
    formData.append('order', updatedLesson.order.toString());
    updateLessonAction(formData);
  };

  const handleDeleteLesson = (lessonId: number) => {
    deleteLessonAction({ lessonId, courseId: course.id });
  };

  const handlePdfUpload = (lessonId: number, file: File) => {
    const formData = new FormData();
    formData.append('lessonId', lessonId.toString());
    formData.append('courseId', course.id.toString());
    formData.append('pdfFile', file);
    uploadPdfAction(formData);
  };

  const handlePdfDelete = (materialId: number) => {
    deletePdfAction({ materialId, courseId: course.id });
  };

  const moveLesson = (dragIndex: number, hoverIndex: number) => {
    const draggedLesson = lessons[dragIndex];
    const newLessons = [...lessons];
    newLessons.splice(dragIndex, 1);
    newLessons.splice(hoverIndex, 0, draggedLesson);

    // Update order property for all lessons
    const reorderedLessons = newLessons.map((lesson, idx) => ({ ...lesson, order: idx + 1 }));
    setLessons(reorderedLessons);

    // Send reordered lessons to server
    reorderLessonsAction({ courseId: course.id, lessonOrder: reorderedLessons.map(l => ({ id: l.id, order: l.order })) });
  };

  const handleAddExternalUserAccess = () => {
    if (newExternalUserEmail) {
      const formData = new FormData();
      formData.append('courseId', course.id.toString());
      formData.append('externalUserEmail', newExternalUserEmail);
      addExternalAccessAction(formData);
    }
  };

  const handleRemoveExternalUserAccess = (accessId: number) => {
    removeExternalAccessAction({ accessId, courseId: course.id });
  };


  return (
    // <DndProvider backend={HTML5Backend}>
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Edit Course: {course.title}</h1>

        {/* Course Status and Actions */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
          <p className="text-lg font-semibold">Status: <span className={`font-bold ${isCoursePublished ? 'text-green-600' : 'text-yellow-600'}`}>{course.status.toUpperCase()}</span></p>
          <div>
            {!isCoursePublished ? (
              <button
                onClick={() => publishCourseAction(course.id)}
                className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Publish Course
              </button>
            ) : (
              <>
                <Link
                  href={`/courses/${course.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  View Public Page
                </Link>
                <button
                  onClick={() => unpublishCourseAction(course.id)}
                  className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Unpublish Course
                </button>
              </>
            )}
          </div>
        </div>

        {/* Course Details Form */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                onBlur={handleUpdateCourseDetails}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={isCoursePublished}
              />
            </div>
            <div>
              <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="courseDescription"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                onBlur={handleUpdateCourseDetails}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={isCoursePublished}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Lessons Management */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lessons</h2>
          <div className="space-y-6">
            {lessons.map((lesson, index) => (
              <Lesson
                key={lesson.id}
                lesson={lesson}
                index={index}
                // moveLesson={moveLesson} // Commented out for now
                onUpdate={handleUpdateLesson}
                onDelete={handleDeleteLesson}
                onPdfUpload={handlePdfUpload}
                onPdfDelete={handlePdfDelete}
                isCoursePublished={isCoursePublished}
              />
            ))}
          </div>
          {!isCoursePublished && (
            <button
              onClick={handleAddLesson}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Lesson
            </button>
          )}
        </div>

        {/* External User Access */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">External User Access</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="externalUserEmail" className="block text-sm font-medium text-gray-700">
                Add External User by Email
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="email"
                  id="externalUserEmail"
                  value={newExternalUserEmail}
                  onChange={(e) => setNewExternalUserEmail(e.target.value)}
                  className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="user@example.com"
                  disabled={isCoursePublished}
                />
                {!isCoursePublished && (
                  <button
                    type="button"
                    onClick={handleAddExternalUserAccess}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Access
                  </button>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Users with Access</h3>
              {externalAccesses.length === 0 ? (
                <p className="text-sm text-gray-500">No external users have access to this course yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {externalAccesses.map(access => (
                    <li key={access.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{access.externalUserId}</p>
                        <p className="text-sm text-gray-500">Access Key: <span className="font-mono">{access.accessKey}</span></p>
                      </div>
                      {!isCoursePublished && (
                        <button onClick={() => handleRemoveExternalUserAccess(access.id)} className="text-red-600 hover:text-red-800 text-sm">
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    // </DndProvider>
  );
}