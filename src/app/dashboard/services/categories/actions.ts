"use server";

import { db } from "@/db";
import { serviceCategories } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { InferInsertModel } from 'drizzle-orm';

type InsertServiceCategory = InferInsertModel<typeof serviceCategories>;

export type FormState = {
  message: string;
  error: string;
} | undefined;

// Helper function to get user ID from session
async function getUserIdFromSession(): Promise<number | undefined> {
  const session = await getSession();
  return session?.user?.id;
}

export async function createServiceCategory(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const customId = formData.get("customId") as string | null; // New: Get customId

  if (!name) {
    return { message: "", error: "Category name is required." };
  }

  try {
    const categoryData: InsertServiceCategory = {
      userId,
      name,
      description,
      customId: customId || null, // New: Include customId
    };

    await db.insert(serviceCategories).values(categoryData);

    revalidatePath("/dashboard/services"); // Revalidate the services page to show new categories
    return { message: "Service category created successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error creating service category:", error);
    let errorMessage = "Failed to create service category.";
    if (error instanceof Error) {
      errorMessage = `Failed to create service category: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function getServiceCategories() {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return [];
  }

  try {
    const categories = await db.query.serviceCategories.findMany({
      where: eq(serviceCategories.userId, userId),
      orderBy: (serviceCategories, { asc }) => [asc(serviceCategories.name)],
    });
    return categories;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return [];
  }
}

export async function updateServiceCategory(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (isNaN(id) || !name) {
    return { message: "", error: "Invalid category ID or name." };
  }

  try {
    await db.update(serviceCategories)
      .set({ name, description, updatedAt: new Date() })
      .where(eq(serviceCategories.id, id));

    revalidatePath("/dashboard/services");
    return { message: "Service category updated successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error updating service category:", error);
    let errorMessage = "Failed to update service category.";
    if (error instanceof Error) {
      errorMessage = `Failed to update service category: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function deleteServiceCategory(id: number): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  if (isNaN(id)) {
    return { message: "", error: "Invalid category ID." };
  }

  try {
    await db.delete(serviceCategories)
      .where(eq(serviceCategories.id, id));

    revalidatePath("/dashboard/services");
    return { message: "Service category deleted successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error deleting service category:", error);
    let errorMessage = "Failed to delete service category.";
    if (error instanceof Error) {
      errorMessage = `Failed to delete service category: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
