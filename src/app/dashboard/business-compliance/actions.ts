"use server";

import { db } from "@/db";
import { businessComplianceChecklist } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getChecklistProgress(businessId: number) {
  try {
    const progress = await db.query.businessComplianceChecklist.findMany({
      where: (businessComplianceChecklist, { eq }) => eq(businessComplianceChecklist.businessId, businessId),
    });
    return progress;
  } catch (error) {
    console.error("Error fetching checklist progress:", error);
    return [];
  }
}

export async function updateChecklistProgress(businessId: number, itemId: string, isChecked: boolean) {
  try {
    const existingItem = await db.query.businessComplianceChecklist.findFirst({
      where: and(
        eq(businessComplianceChecklist.businessId, businessId),
        eq(businessComplianceChecklist.itemId, itemId)
      ),
    });

    if (existingItem) {
      await db.update(businessComplianceChecklist).set({ isChecked }).where(eq(businessComplianceChecklist.id, existingItem.id));
    } else {
      await db.insert(businessComplianceChecklist).values({
        businessId,
        itemId,
        isChecked,
      });
    }

    return { message: "Progress updated successfully!" };
  } catch (error) {
    console.error("Error updating checklist progress:", error);
    return { error: "Failed to update progress." };
  }
}
