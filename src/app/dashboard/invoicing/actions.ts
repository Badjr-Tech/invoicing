"use server";

import { db } from "@/db";
import { invoices, clients } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export type FormState = {
  message: string;
  error: string;
} | undefined;

export async function createInvoice(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to create an invoice." };
  }

  const clientId = parseInt(formData.get("clientId") as string);
  const serviceDescription = formData.get("serviceDescription") as string;
  const amount = parseFloat(formData.get("amount") as string);

  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });

    if (!client) {
      return { message: "", error: "Client not found." };
    }

    await db.insert(invoices).values({
      userId: session.user.id,
      clientName: client.name,
      clientEmail: client.email,
      serviceDescription,
      amount,
    });

    revalidatePath("/dashboard/invoicing");
    return { message: "Invoice created successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error creating invoice:", error);
    let errorMessage = "Failed to create invoice.";
    if (error instanceof Error) {
      errorMessage = `Failed to create invoice: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
