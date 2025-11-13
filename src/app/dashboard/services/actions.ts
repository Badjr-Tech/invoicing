export async function getAllServices() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'admin') {
    return [];
  }

  try {
    const allServices = await db.query.services.findMany();
    return allServices;
  } catch (error) {
    console.error("Error fetching all services:", error);
    return [];
  }
}