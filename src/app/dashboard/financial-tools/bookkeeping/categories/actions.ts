"use server";

import { db } from "@/db";
import { transactionCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/app/login/actions";

export async function getTransactionCategories() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  try {
    const categories = await db.query.transactionCategories.findMany({
      where: eq(transactionCategories.userId, userId),
    });
    return categories;
  } catch (error) {
    console.error("Error fetching transaction categories:", error);
    return [];
  }
}

export async function createTransactionCategory(formData: FormData) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "User not authenticated." };
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";

  if (!name || !type) {
    return { error: "Name and type are required." };
  }

  try {
    await db.insert(transactionCategories).values({
      userId,
      name,
      type,
    });

    revalidatePath("/dashboard/financial-tools/bookkeeping/categories");
    return { message: "Category created successfully!" };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category." };
  }
}

export async function updateTransactionCategory(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";

  if (isNaN(id) || !name || !type) {
    return { error: "Invalid input." };
  }

  try {
    await db.update(transactionCategories)
      .set({ name, type })
      .where(eq(transactionCategories.id, id));

    revalidatePath("/dashboard/financial-tools/bookkeeping/categories");
    return { message: "Category updated successfully!" };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category." };
  }
}

export async function deleteTransactionCategory(id: number) {
  try {
    await db.delete(transactionCategories).where(eq(transactionCategories.id, id));

    revalidatePath("/dashboard/financial-tools/bookkeeping/categories");
    return { message: "Category deleted successfully!" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category." };
  }
}
