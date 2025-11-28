"use server";

import { db } from "@/db";
import { transactions, transactionType } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTransactions(businessId: number) {
  try {
    const allTransactions = await db.query.transactions.findMany({
      where: eq(transactions.businessId, businessId),
      with: {
        service: true,
      },
      orderBy: (transactions, { desc }) => [desc(transactions.date)],
    });
    return allTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function addTransaction(formData: FormData) {
  const businessId = parseInt(formData.get("businessId") as string);
  const serviceId = formData.get("serviceId") ? parseInt(formData.get("serviceId") as string) : null;
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as 'income' | 'expense';
  const date = new Date(formData.get("date") as string);
  const notes = formData.get("notes") as string;

  if (isNaN(businessId) || !description || isNaN(amount) || !type || !date) {
    return { error: "Invalid input." };
  }

  try {
    await db.insert(transactions).values({
      businessId,
      serviceId,
      description,
      amount: amount.toString(),
      type,
      date,
      notes,
    });

    revalidatePath("/dashboard/products/bookkeeping");
    return { message: "Transaction added successfully!" };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { error: "Failed to add transaction." };
  }
}
