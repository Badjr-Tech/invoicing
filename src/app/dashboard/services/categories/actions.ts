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
  const businessId = parseInt(formData.get("businessId") as string);
  const dbaId = formData.get("dbaId") ? parseInt(formData.get("dbaId") as string) : undefined; // New: Get optional dbaId

  if (!name) {
    return { message: "", error: "Category name is required." };
  }
  if (isNaN(businessId) && dbaId === undefined) { // Business or DBA must be selected
    return { message: "", error: "Business or DBA selection is required." };
  }

  try {
    const categoryData: InsertServiceCategory = {
      userId,
      name,
      description,
      customId: customId || null,
      ...(businessId && { businessId }), // Conditionally add businessId
      ...(dbaId && { dbaId }), // Conditionally add dbaId
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
      where: and(
        eq(serviceCategories.userId, userId),
        // Categories can be associated with a business OR a DBA
        // We need to fetch both to display correctly
        // The actual filtering for display will happen in the UI
      ),
      with: { // Fetch related business and DBA information
        business: {
          columns: {
            businessName: true,
          },
        },
        dba: { // New: Fetch related DBA information
          columns: {
            dbaName: true,
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
      with: { // New: Include associated DBAs
        dbas: {
          columns: {
            id: true,
            dbaName: true,
          },
        },
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
  const businessId = parseInt(formData.get("businessId") as string);
  const dbaId = formData.get("dbaId") ? parseInt(formData.get("dbaId") as string) : undefined; // New: Get optional dbaId

  if (isNaN(id) || !name) {
    return { message: "", error: "Invalid category ID or name." };
  }
  if (isNaN(businessId) && dbaId === undefined) { // Business or DBA must be selected
    return { message: "", error: "Business or DBA selection is required." };
  }

  try {
    const updateData: {
      name: string;
      description: string | null;
      customId: string | null;
      businessId?: number | null;
      dbaId?: number | null;
      updatedAt: Date;
    } = {
      name,
      description,
      customId: customId || null,
      updatedAt: new Date(),
    };

    if (businessId) {
      updateData.businessId = businessId;
      updateData.dbaId = null; // If businessId is set, dbaId should be null
    } else if (dbaId) {
      updateData.dbaId = dbaId;
      updateData.businessId = null; // If dbaId is set, businessId should be null
    } else {
      updateData.businessId = null;
      updateData.dbaId = null;
    }

    await db.update(serviceCategories)
      .set(updateData)
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
