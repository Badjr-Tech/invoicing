"use server";

import { db } from "@/db";
import { dbas } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";

export async function createDba(
  prevState: { message?: string; error?: string } | undefined,
  formData: FormData
) {
  const session = await getSession();
  if (!session || !session.user) {
    return { error: "You must be logged in to create a DBA." };
  }

  const userId = session.user.id;
  const dbaName = formData.get("dbaName") as string;
  const businessId = formData.get("businessId") as string;
  const description = formData.get("description") as string;

  if (!dbaName || !businessId) {
    return { error: "DBA Name and Associated Business are required." };
  }

  try {
    await db.insert(dbas).values({
      businessId: parseInt(businessId),
      name: dbaName,
    });

    revalidatePath("/dashboard/businesses");
    return { message: "DBA created successfully!" };
  } catch (error) {
    console.error("Error creating DBA:", error);
    return { error: "Failed to create DBA." };
  }
}
