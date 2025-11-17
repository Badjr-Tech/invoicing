"use server";

import { db } from "@/db";
import { invoices, clients, businesses } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { InferInsertModel } from 'drizzle-orm'; // Import InferInsertModel

interface Service {
  name: string;
  price: string;
  description: string | null;
  quantity: number;
  type: 'hourly' | 'per_deliverable' | 'flat_fee';
}

type InsertInvoice = InferInsertModel<typeof invoices>; // Define InsertInvoice type

export type FormState = {
  message: string;
  error: string;
  invoice?: {
    client: { name: string; email: string };
    services: Service[]; // Use updated Service interface
    totalAmount: number;
    user: { logoUrl: string | null };
    dueDate: Date | null;
    invoiceNumber: string; // New
    notes: string | null; // New
    invoiceBusinessDisplayName: string; // New
  };
} | undefined;

export async function createInvoice(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to create an invoice." };
  }

  const clientId = parseInt(formData.get("clientId") as string);
  const businessId = parseInt(formData.get("businessId") as string);
  const services: Service[] = JSON.parse(formData.get("services") as string);
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  const notes = formData.get("notes") as string;
  const invoiceNumber = formData.get("invoiceNumber") as string; // Get invoiceNumber from form
  const invoiceBusinessDisplayName = formData.get("invoiceBusinessDisplayName") as string; // Get invoiceBusinessDisplayName from form

  const dueDateString = formData.get("dueDate") as string;
  const dueDate = dueDateString ? new Date(dueDateString) : null;

  if (!clientId || !businessId || !services || services.length === 0 || !invoiceNumber || !invoiceBusinessDisplayName) {
    return { message: "", error: "Please select a client, a business, at least one service, and provide an invoice number and business display name." };
  }

  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });

    if (!client) {
      return { message: "", error: "Client not found." };
    }

    const business = await db.query.businesses.findFirst({
      where: and(eq(businesses.userId, session.user.id), eq(businesses.id, businessId)),
    });

    if (!business) {
      return { message: "", error: "Business not found." };
    }

    const invoiceData: InsertInvoice = {
      userId: session.user.id,
      businessId: business.id,
      clientName: client.name,
      clientEmail: client.email,
      servicesJson: JSON.stringify(services),
      amount: totalAmount.toFixed(2),
      dueDate,
      invoiceNumber,
      notes,
      invoiceBusinessDisplayName, // Save invoiceBusinessDisplayName
    };

    const [newInvoice] = await db.insert(invoices).values(invoiceData).returning();

    revalidatePath("/dashboard/invoicing");
    return {
      message: "Invoice created successfully!",
      error: "",
      invoice: {
        client: { name: client.name, email: client.email },
        services,
        totalAmount,
        user: { logoUrl: business?.logoUrl || null },
        dueDate,
        invoiceNumber,
        notes,
        invoiceBusinessDisplayName, // Return invoiceBusinessDisplayName
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

export async function getAllInvoices() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'admin') {
    return [];
  }

  try {
    const allInvoices = await db.query.invoices.findMany();
    return allInvoices;
  } catch (error) {
    console.error("Error fetching all invoices:", error);
    return [];
  }
}

export async function archiveInvoice(invoiceId: number, archiveStatus: boolean): Promise<FormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: "", error: "You must be logged in to archive an invoice." };
  }

  try {
    await db.update(invoices)
      .set({ isArchived: archiveStatus })
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)));

    revalidatePath("/dashboard/invoices");
    return { message: `Invoice ${archiveStatus ? 'archived' : 'unarchived'} successfully!`, error: "" };
  } catch (error) {
    console.error("Error archiving/unarchiving invoice:", error);
    let errorMessage = `Failed to ${archiveStatus ? 'archive' : 'unarchive'} invoice.`;
    if (error instanceof Error) {
      errorMessage = `Failed to ${archiveStatus ? 'archive' : 'unarchive'} invoice: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function getInvoices(includeArchived: boolean = false) {
  const session = await getSession();
  if (!session || !session.user) {
    return [];
  }

  const conditions = [eq(invoices.userId, session.user.id)];
  if (!includeArchived) {
    conditions.push(eq(invoices.isArchived, false));
  }

  const userInvoices = await db.query.invoices.findMany({
    where: and(...conditions),
  });

  return userInvoices;
}
