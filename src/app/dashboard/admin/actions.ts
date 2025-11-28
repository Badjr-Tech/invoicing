"use server";

import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBusinessAdminFee(prevState: any, formData: FormData) {
  const businessId = parseInt(formData.get("businessId") as string);
  const adminFee = parseFloat(formData.get("adminFee") as string);

  if (isNaN(businessId) || isNaN(adminFee)) {
    return { error: "Invalid input." };
  }

  try {
    await db.update(businesses)
      .set({ adminFee: adminFee.toString() })
      .where(eq(businesses.id, businessId));

    revalidatePath("/dashboard/admin/agency-setup");
    return { message: "Admin fee updated successfully!" };
  } catch (error) {
    console.error("Error updating admin fee:", error);
    return { error: "Failed to update admin fee." };
  }
}
