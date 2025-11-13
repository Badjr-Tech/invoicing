export async function getInvoices() {
  const session = await getSession();
  if (!session || !session.user) {
    return [];
  }

  const userInvoices = await db.query.invoices.findMany({
    where: eq(invoices.userId, session.user.id),
  });

  return userInvoices;
}