"use server";

import { db } from "@/db";
import { recurringTransactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/app/login/actions";

export async function getRecurringTransactions() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  try {
    // This is a simplified query. In a real application, you would want to filter by businessId as well.
    const transactions = await db.query.recurringTransactions.findMany();
    return transactions;
  } catch (error) {
    console.error("Error fetching recurring transactions:", error);
    return [];
  }
}

export async function createRecurringTransaction(formData: FormData) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "User not authenticated." };
  }

  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "income" | "expense";
  const categoryId = parseInt(formData.get("categoryId") as string);
  const frequency = formData.get("frequency") as "daily" | "weekly" | "monthly" | "yearly";
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null;

  if (!description || isNaN(amount) || !type || !frequency || !startDate) {
    return { error: "Invalid input." };
  }

  try {
    // This is a simplified insert. In a real application, you would want to associate the transaction with a business.
    await db.insert(recurringTransactions).values({
      description,
      amount,
      type,
      categoryId,
      frequency,
      startDate,
      endDate,
      businessId: 1, // This should be replaced with the actual businessId
    });

    revalidatePath("/dashboard/financial-tools/bookkeeping/recurring");
    return { message: "Recurring transaction created successfully!" };
  } catch (error) {
    console.error("Error creating recurring transaction:", error);
    return { error: "Failed to create recurring transaction." };
  }
}

export async function updateRecurringTransaction(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "income" | "expense";
  const categoryId = parseInt(formData.get("categoryId") as string);
  const frequency = formData.get("frequency") as "daily" | "weekly" | "monthly" | "yearly";
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null;

  if (isNaN(id) || !description || isNaN(amount) || !type || !frequency || !startDate) {
    return { error: "Invalid input." };
  }

  try {
    await db.update(recurringTransactions)
      .set({
        description,
        amount,
        type,
        categoryId,
        frequency,
        startDate,
        endDate,
      })
      .where(eq(recurringTransactions.id, id));

    revalidatePath("/dashboard/financial-tools/bookkeeping/recurring");
    return { message: "Recurring transaction updated successfully!" };
  } catch (error) {
    console.error("Error updating recurring transaction:", error);
    return { error: "Failed to update recurring transaction." };
  }
}

export async function deleteRecurringTransaction(id: number) {
  try {
    await db.delete(recurringTransactions).where(eq(recurringTransactions.id, id));

    revalidatePath("/dashboard/financial-tools/bookkeeping/recurring");
    return { message: "Recurring transaction deleted successfully!" };
  } catch (error) {
    console.error("Error deleting recurring transaction:", error);
    return { error: "Failed to delete recurring transaction." };
  }
}
