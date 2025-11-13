"use server";

import { db } from "@/db";
import { services } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export type FormState = {
  message: string;
  error: string;
} | undefined;

export async function createService(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to create a service." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);

  try {
    await db.insert(services).values({
      userId: session.user.id,
      name,
      description,
      price,
    });

    revalidatePath("/dashboard/services");
    return { message: "Service created successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error creating service:", error);
    let errorMessage = "Failed to create service.";
    if (error instanceof Error) {
      errorMessage = `Failed to create service: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function getServices() {
  const session = await getSession();
  if (!session || !session.user) {
    return [];
  }

  const userServices = await db.query.services.findMany({
    where: eq(services.userId, session.user.id),
  });

  return userServices;
}
