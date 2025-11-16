"use server";

import { db } from "@/db";
import { invoices, invoiceStatus } from "@/db/schema";
import { getSession } from "@/app/login/actions";
import { and, eq, sum } from "drizzle-orm";

// Helper function to get user ID from session
async function getUserIdFromSession(): Promise<number | undefined> {
  const session = await getSession();
  return session?.user?.id;
}

export async function getOutstandingInvoices() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return { totalAmount: 0, count: 0, invoices: [] };
  }

  try {
    const outstandingInvoices = await db.query.invoices.findMany({
      where: and(
        eq(invoices.userId, userId),
        eq(invoices.status, 'sent') // Assuming 'sent' means outstanding
      ),
    });

    const totalAmount = outstandingInvoices.reduce((acc, invoice) => acc + parseFloat(invoice.amount), 0);

    return {
      totalAmount,
      count: outstandingInvoices.length,
      invoices: outstandingInvoices,
    };
  } catch (error) {
    console.error("Error fetching outstanding invoices:", error);
    return { totalAmount: 0, count: 0, invoices: [] };
  }
}

export async function getSuccessfulPayments() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return { totalAmount: 0, count: 0, invoices: [] };
  }

  try {
    const paidInvoices = await db.query.invoices.findMany({
      where: and(
        eq(invoices.userId, userId),
        eq(invoices.status, 'paid')
      ),
    });

    const totalAmount = paidInvoices.reduce((acc, invoice) => acc + parseFloat(invoice.amount), 0);

    return {
      totalAmount,
      count: paidInvoices.length,
      invoices: paidInvoices,
    };
  } catch (error) {
    console.error("Error fetching successful payments:", error);
    return { totalAmount: 0, count: 0, invoices: [] };
  }
}

export async function getIncomeMinusFees() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return { totalIncome: 0, totalFees: 0, netIncome: 0 };
  }

  try {
    const paidInvoices = await db.query.invoices.findMany({
      where: and(
        eq(invoices.userId, userId),
        eq(invoices.status, 'paid')
      ),
    });

    const totalIncome = paidInvoices.reduce((acc, invoice) => acc + parseFloat(invoice.amount), 0);

    // Placeholder for fees calculation. In a real app, fees would come from a separate table or a more complex calculation.
    const totalFees = totalIncome * 0.029 + paidInvoices.length * 0.30; // Example: 2.9% + 30 cents per transaction

    const netIncome = totalIncome - totalFees;

    return {
      totalIncome,
      totalFees,
      netIncome,
    };
  } catch (error) {
    console.error("Error calculating income minus fees:", error);
    return { totalIncome: 0, totalFees: 0, netIncome: 0 };
  }
}
