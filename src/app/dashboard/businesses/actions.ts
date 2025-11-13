export async function getAllBusinesses() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'admin') {
    return [];
  }

  try {
    const allBusinesses = await db.query.businesses.findMany();
    return allBusinesses;
  } catch (error) {
    console.error("Error fetching all businesses:", error);
    return [];
  }
}