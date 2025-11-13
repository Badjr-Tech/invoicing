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