"use server";

import { db } from "@/db";
import { services, serviceDesignationEnum } from "@/db/schema"; // Import serviceDesignationEnum
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq, and, sql, max } from "drizzle-orm"; // Import 'and', 'sql', 'max'
import { InferInsertModel } from 'drizzle-orm'; // Import InferInsertModel

type InsertService = InferInsertModel<typeof services>; // Define InsertService type

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
  const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : undefined;
  const designation = formData.get("designation") as typeof serviceDesignationEnum.enumValues[number]; // New: Get designation
  let serviceNumber = formData.get("serviceNumber") as string | undefined; // New: Get serviceNumber

  if (!name || isNaN(price) || !designation) {
    return { message: "", error: "Name, price, and designation are required." };
  }

  try {
    // Generate sequential serviceNumber if not provided
    if (!serviceNumber) {
      const latestService = await db.query.services.findFirst({
        where: eq(services.userId, session.user.id),
        orderBy: (services, { desc }) => desc(sql`CAST(${services.serviceNumber} AS INTEGER)`),
      });

      const lastServiceNumber = latestService?.serviceNumber ? parseInt(latestService.serviceNumber) : 0;
      serviceNumber = (lastServiceNumber + 1).toString();
    }

    const serviceData: InsertService = {
      userId: session.user.id,
      categoryId,
      name,
      description,
      price: price.toString(),
      designation, // New: Include designation
      serviceNumber, // New: Include serviceNumber
    };

    await db.insert(services).values(serviceData);

    revalidatePath("/dashboard/services");
    if (categoryId) {
      revalidatePath(`/dashboard/services/${categoryId}`);
    }
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

export async function getServices(categoryId?: number) { // New: Accept optional categoryId
  const session = await getSession();
  if (!session || !session.user) {
    return [];
  }

  const conditions = [eq(services.userId, session.user.id)];
  if (categoryId !== undefined) {
    conditions.push(eq(services.categoryId, categoryId));
  }

  const userServices = await db.query.services.findMany({
    where: and(...conditions),
    with: {
      category: true, // New: Fetch category details
    },
  });

  return userServices;
}

export async function getAllServices() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'admin') {
    return [];
  }

  try {
    const allServices = await db.query.services.findMany({
      with: {
        category: true, // New: Fetch category details
      },
    });
    return allServices;
  } catch (error) {
    console.error("Error fetching all services:", error);
    return [];
  }
}
