"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { InferInsertModel } from 'drizzle-orm'; // Import InferInsertModel

type InsertClient = InferInsertModel<typeof clients>; // Define InsertClient type

export type FormState = {
  message: string;
  error: string;
} | undefined;

export async function createClient(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to create a client." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const clientBusinessName = formData.get("clientBusinessName") as string; // New: Get optional clientBusinessName

  try {
    const clientData: InsertClient = {
      userId: session.user.id,
      name,
      email,
      clientBusinessName: clientBusinessName || null, // New: Add clientBusinessName
    };

    await db.insert(clients).values(clientData);

    revalidatePath("/dashboard/clients");
    return { message: "Client created successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error creating client:", error);
    let errorMessage = "Failed to create client.";
    if (error instanceof Error) {
      errorMessage = `Failed to create client: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function getClients() {
  const session = await getSession();
  if (!session || !session.user) {
    return [];
  }

  const userClients = await db.query.clients.findMany({
    where: eq(clients.userId, session.user.id),
  });

  return userClients;
}

export async function getAllClients() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'admin') {
    return [];
  }

  try {
    const allClients = await db.query.clients.findMany();
    return allClients;
  } catch (error) {
    console.error("Error fetching all clients:", error);
    return [];
  }
}

export async function updateClient(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to update a client." };
  }

  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const clientBusinessName = formData.get("clientBusinessName") as string; // New: Get clientBusinessName

  if (isNaN(id)) {
    return { message: "", error: "Invalid client ID." };
  }

  try {
    await db.update(clients)
      .set({
        name,
        email,
        clientBusinessName: clientBusinessName || null, // Update clientBusinessName
      })
      .where(eq(clients.id, id));

    revalidatePath("/dashboard/clients");
    return { message: "Client updated successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error updating client:", error);
    let errorMessage = "Failed to update client.";
    if (error instanceof Error) {
      errorMessage = `Failed to update client: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
