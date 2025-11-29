"use server";

import { db } from "@/db";
import { invoices, transactions, platformSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateInvoiceStatus(invoiceId: number, status: 'draft' | 'sent' | 'paid') {
  try {
    const [updatedInvoice] = await db.update(invoices)
      .set({ status })
      .where(eq(invoices.id, invoiceId))
      .returning();

    if (status === 'paid' && updatedInvoice) {
      // Create income transaction
      await db.insert(transactions).values({
        businessId: updatedInvoice.businessId,
        description: `Invoice #${updatedInvoice.invoiceNumber} paid`,
        amount: updatedInvoice.amount,
        type: 'income',
        date: new Date(),
        notes: `From invoice #${updatedInvoice.invoiceNumber}`,
      });

      // Get platform admin fee
      const platform = await db.query.platformSettings.findFirst();
      const adminFeePercentage = platform?.adminFee ? parseFloat(platform.adminFee) : 0;

      if (adminFeePercentage > 0) {
        const adminFeeAmount = parseFloat(updatedInvoice.amount) * (adminFeePercentage / 100);
        // Create expense transaction for admin fee
        await db.insert(transactions).values({
          businessId: updatedInvoice.businessId,
          description: `Admin Fee for Invoice #${updatedInvoice.invoiceNumber}`,
          amount: adminFeeAmount.toString(),
          type: 'expense',
          date: new Date(),
          notes: `Admin fee (${adminFeePercentage}%) for invoice #${updatedInvoice.invoiceNumber}`,
        });
      }
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/products/bookkeeping");
    return { message: "Invoice status updated successfully!" };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { error: "Failed to update invoice status." };
  }
}
