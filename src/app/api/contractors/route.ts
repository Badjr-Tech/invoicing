import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contractors } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { getSessionUser } from '@/lib/session';
import { getOwnedBusinessIds } from '@/lib/tenancy';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, role, monthlyPayment, businessId } = body;

    if (!name || !email || !monthlyPayment || !businessId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const parsedBusinessId = Number(businessId);
    const parsedPayment = Number(monthlyPayment);

    if (!Number.isInteger(parsedBusinessId) || Number.isNaN(parsedPayment)) {
      return new NextResponse('Invalid field values', { status: 400 });
    }

    // businessId comes from the client, so ownership must be verified before
    // the insert — otherwise a caller can write into anyone's business.
    const ownedBusinessIds = await getOwnedBusinessIds(user.id);
    if (!ownedBusinessIds.includes(parsedBusinessId)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const newContractor = await db.insert(contractors).values({
      userId: user.id,
      businessId: parsedBusinessId,
      name: name,
      email: email,
      role: role,
      // numeric(10,2) round-trips as a string in Drizzle; handing it a number
      // fails the insert at runtime.
      monthlyPayment: parsedPayment.toFixed(2),
    }).returning();

    return NextResponse.json(newContractor[0], { status: 201 });
  } catch (error) {
    console.error('Error adding contractor:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const businessIds = await getOwnedBusinessIds(user.id);

    if (businessIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const fetchedContractors = await db
      .select()
      .from(contractors)
      .where(inArray(contractors.businessId, businessIds));

    const contractorsWithNumericPayment = fetchedContractors.map(c => ({
      ...c,
      monthlyPayment: c.monthlyPayment ? parseFloat(c.monthlyPayment) : 0,
    }));

    return NextResponse.json(contractorsWithNumericPayment, { status: 200 });
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
