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