"use server";

import { db } from "@/db";
import { checklistItems } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getChecklistItems() {
  const session = await getSession();
  if (!session || !session.user) {
    return [];
  }

  const items = await db.query.checklistItems.findMany({
    where: eq(checklistItems.userId, session.user.id),
  });

  if (items.length === 0) {
    // If the user has no checklist items, create the default ones
    const defaultItems = [
      // Business Plan
      { category: "Business Plan", text: "Executive Summary" },
      { category: "Business Plan", text: "Company Description" },
      { category: "Business Plan", text: "Market Analysis" },
      { category: "Business Plan", text: "Organization and Management" },
      { category: "Business Plan", text: "Service or Product Line" },
      { category: "Business Plan", text: "Marketing and Sales" },
      { category: "Business Plan", text: "Financial Projections" },
      // Financials
      { category: "Financials", text: "Open a business bank account" },
      { category: "Financials", text: "Secure funding" },
      { category: "Financials", text: "Set up a bookkeeping system" },
      // Marketing
      { category: "Marketing", text: "Create a brand identity" },
      { category: "Marketing", text: "Build a website" },
      { category: "Marketing", text: "Develop a social media presence" },
      // Legal
      { category: "Legal", text: "Register your business name" },
      { category: "Legal", text: "Obtain a federal tax ID number" },
      { category: "Legal", text: "Apply for state and local licenses" },
    ];

    if (!session.user) {
      return [];
    }

    const newItems = defaultItems.map(item => ({
      ...item,
      userId: session.user!.id,
    }));

    const insertedItems = await db.insert(checklistItems).values(newItems).returning();
    return insertedItems;
  }

  return items;
}

export async function updateChecklistItem(itemId: number, isChecked: boolean) {
  const session = await getSession();
  if (!session || !session.user) {
    return;
  }

  await db.update(checklistItems)
    .set({ isChecked })
    .where(and(eq(checklistItems.id, itemId), eq(checklistItems.userId, session.user.id)));

  revalidatePath("/dashboard/business-checklist");
}
