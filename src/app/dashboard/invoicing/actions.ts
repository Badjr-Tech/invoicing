"use server";

import { db } from "@/db";
import { invoices, clients } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export type FormState = {
  message: string;
  error: string;
  invoice?: {
    client: { name: string; email: string };
    services: { name: string; price: string }[];
    totalAmount: number;
    user: { logoUrl: string | null };
  };
} | undefined;

export async function createInvoice(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to create an invoice." };
  }

  const clientId = parseInt(formData.get("clientId") as string);
  const services = JSON.parse(formData.get("services") as string);
  const totalAmount = parseFloat(formData.get("totalAmount") as string);

  if (!clientId || !services || services.length === 0) {
    return { message: "", error: "Please select a client and at least one service." };
  }

  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });

    if (!client) {
      return { message: "", error: "Client not found." };
    }

    const serviceDescription = services.map((s: any) => s.name).join(", ");

    const [newInvoice] = await db.insert(invoices).values({
      userId: session.user.id,
      clientName: client.name,
      clientEmail: client.email,
      serviceDescription,
      amount: totalAmount,
    }).returning();

    revalidatePath("/dashboard/invoicing");
    return {
      message: "Invoice created successfully!",
      error: "",
      invoice: {
        client: { name: client.name, email: client.email },
        services,
        totalAmount,
        user: { logoUrl: session.user.profilePhotoUrl },
      },
    };
  } catch (error: unknown) {
    console.error("Error creating invoice:", error);
    let errorMessage = "Failed to create invoice.";
    if (error instanceof Error) {
      errorMessage = `Failed to create invoice: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

