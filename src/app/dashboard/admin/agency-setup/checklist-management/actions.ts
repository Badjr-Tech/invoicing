"use server";

import { db } from "@/db";
import { adminChecklistItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAdminChecklistItems(category: string) {
  try {
    const items = await db.query.adminChecklistItems.findMany({
      where: eq(adminChecklistItems.category, category),
    });
    return items;
  } catch (error) {
    console.error("Error fetching admin checklist items:", error);
    return [];
  }
}

export async function createAdminChecklistItem(formData: FormData) {
  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const itemId = formData.get("itemId") as string;

  if (!category || !title || !itemId) {
    return { error: "Category, title, and item ID are required." };
  }

  try {
    await db.insert(adminChecklistItems).values({
      category,
      title,
      description,
      link,
      itemId,
    });

    revalidatePath("/dashboard/admin/checklist-management");
    return { message: "Checklist item created successfully!" };
  } catch (error) {
    console.error("Error creating checklist item:", error);
    return { error: "Failed to create checklist item." };
  }
}

export async function updateAdminChecklistItem(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;

  if (isNaN(id) || !title) {
    return { error: "Invalid input." };
  }

  try {
    await db.update(adminChecklistItems)
      .set({ title, description, link })
      .where(eq(adminChecklistItems.id, id));

    revalidatePath("/dashboard/admin/checklist-management");
    return { message: "Checklist item updated successfully!" };
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return { error: "Failed to update checklist item." };
  }
}

export async function deleteAdminChecklistItem(id: number) {
  try {
    await db.delete(adminChecklistItems).where(eq(adminChecklistItems.id, id));

    revalidatePath("/dashboard/admin/checklist-management");
    return { message: "Checklist item deleted successfully!" };
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    return { error: "Failed to delete checklist item." };
  }
}
