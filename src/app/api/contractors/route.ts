import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contractors, businesses } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function POST(request: Request) {
  // TODO: Implement proper authentication and get the actual userId
  const userId = 1; // Placeholder userId for now

  // if (!userId) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    const body = await request.json();
    const { name, email, role, monthlyPayment, businessId } = body;

    // Basic validation
    if (!name || !email || !monthlyPayment || !businessId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newContractor = await db.insert(contractors).values({
      userId: userId,
      businessId: businessId,
      name: name,
      email: email,
      role: role,
      monthlyPayment: parseFloat(monthlyPayment),
      // Removed 1099 fields
    }).returning();

    return NextResponse.json(newContractor[0], { status: 201 });
  } catch (error) {
    console.error('Error adding contractor:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  // TODO: Implement proper authentication and get the actual userId
  const userId = 1; // Placeholder userId for now

  // if (!userId) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    // First, get all businesses owned by the current user
    const userBusinesses = await db.select({ id: businesses.id }).from(businesses).where(eq(businesses.userId, userId));
    const businessIds = userBusinesses.map(b => b.id);

    if (businessIds.length === 0) {
      return NextResponse.json([], { status: 200 }); // No businesses, no contractors
    }

    // Then, fetch contractors associated with these businesses
    const fetchedContractors = await db.select().from(contractors).where(inArray(contractors.businessId, businessIds));

    const contractorsWithNumericPayment = fetchedContractors.map(c => ({
      ...c,
      monthlyPayment: parseFloat(c.monthlyPayment),
    }));

    return NextResponse.json(contractorsWithNumericPayment, { status: 200 });
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
