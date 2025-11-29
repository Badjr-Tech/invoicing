"use server";

import { db } from "@/db";
import { platformSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPlatformAdminFee() {
  try {
    const settings = await db.query.platformSettings.findFirst();
    return settings?.adminFee ? parseFloat(settings.adminFee) : 0;
  } catch (error) {
    console.error("Error fetching platform admin fee:", error);
    return 0;
  }
}

export async function updatePlatformAdminFee(prevState: any, formData: FormData) {
  const adminFee = parseFloat(formData.get("adminFee") as string);

  if (isNaN(adminFee)) {
    return { error: "Invalid input." };
  }

  try {
    const existingSettings = await db.query.platformSettings.findFirst();

    if (existingSettings) {
      await db.update(platformSettings)
        .set({ adminFee: adminFee.toString() })
        .where(eq(platformSettings.id, existingSettings.id));
    } else {
      await db.insert(platformSettings).values({ adminFee: adminFee.toString() });
    }

    revalidatePath("/dashboard/admin/agency-setup");
    return { message: "Platform admin fee updated successfully!" };
  } catch (error) {
    console.error("Error updating platform admin fee:", error);
    return { error: "Failed to update platform admin fee." };
  }
}
