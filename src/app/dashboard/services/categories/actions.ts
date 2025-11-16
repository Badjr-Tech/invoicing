"use server";

import { db } from "@/db";
import { serviceCategories, businesses } from "@/db/schema"; // Import businesses schema
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm"; // Import 'and' for multiple conditions
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
  const customId = formData.get("customId") as string | null;
  const businessId = parseInt(formData.get("businessId") as string); // New: Get businessId

  if (!name) {
    return { message: "", error: "Category name is required." };
  }
  if (isNaN(businessId)) {
    return { message: "", error: "Business selection is required." };
  }

  try {
    const categoryData: InsertServiceCategory = {
      userId,
      businessId, // New: Include businessId
      name,
      description,
      customId: customId || null,
    };

    await db.insert(serviceCategories).values(categoryData);

    revalidatePath("/dashboard/services");
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
      with: { // Fetch related business information
        business: {
          columns: {
            businessName: true,
          },
        },
      },
      orderBy: (serviceCategories, { asc }) => [asc(serviceCategories.name)],
    });
    return categories;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return [];
  }
}

export async function getUserBusinesses() {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return [];
  }

  try {
    const userBusinesses = await db.query.businesses.findMany({
      where: eq(businesses.userId, userId),
      columns: {
        id: true,
        businessName: true,
      },
    });
    return userBusinesses;
  } catch (error) {
    console.error("Error fetching user businesses:", error);
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
  const customId = formData.get("customId") as string | null;
  const businessId = parseInt(formData.get("businessId") as string); // New: Get businessId

  if (isNaN(id) || !name) {
    return { message: "", error: "Invalid category ID or name." };
  }
  if (isNaN(businessId)) {
    return { message: "", error: "Business selection is required." };
  }

  try {
    await db.update(serviceCategories)
      .set({ name, description, customId: customId || null, businessId, updatedAt: new Date() }) // New: Update customId and businessId
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
