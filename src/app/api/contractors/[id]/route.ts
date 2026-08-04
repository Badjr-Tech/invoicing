import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { contractors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/session';
import { getOwnedBusinessIds } from '@/lib/tenancy';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const contractorId = parseInt(id);

  if (isNaN(contractorId)) {
    return new NextResponse('Invalid Contractor ID', { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, role, monthlyPayment, businessId, invitationToken, invitationSentAt, onboardedAt, w9Url, contractorTaxId, contractorAddress, contractorCity, contractorState, contractorZipCode } = body;

    const existingContractor = await db.select().from(contractors).where(eq(contractors.id, contractorId));

    if (existingContractor.length === 0) {
      return new NextResponse('Contractor not found', { status: 404 });
    }

    const ownedBusinessIds = await getOwnedBusinessIds(user.id);

    if (!ownedBusinessIds.includes(existingContractor[0].businessId)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // A reassignment must land in a business the caller also owns, otherwise
    // the update becomes a way to push a record into someone else's tenant.
    let nextBusinessId: number | undefined;
    if (businessId !== undefined) {
      nextBusinessId = Number(businessId);
      if (!Number.isInteger(nextBusinessId) || !ownedBusinessIds.includes(nextBusinessId)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    const updatedContractor = await db.update(contractors).set({
      name: name,
      role: role,
      // numeric(10,2) round-trips as a string in Drizzle; handing it a number
      // fails the update at runtime.
      monthlyPayment: monthlyPayment ? Number(monthlyPayment).toFixed(2) : undefined,
      businessId: nextBusinessId,
      invitationToken: invitationToken,
      invitationSentAt: invitationSentAt ? new Date(invitationSentAt) : undefined,
      onboardedAt: onboardedAt ? new Date(onboardedAt) : undefined,
      w9Url: w9Url,
      contractorTaxId: contractorTaxId,
      contractorAddress: contractorAddress,
      contractorCity: contractorCity,
      contractorState: contractorState,
      contractorZipCode: contractorZipCode,
      updatedAt: new Date(),
    }).where(eq(contractors.id, contractorId)).returning();

    return NextResponse.json(updatedContractor[0], { status: 200 });
  } catch (error) {
    console.error('Error updating contractor:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const contractorId = parseInt(id);

  if (isNaN(contractorId)) {
    return new NextResponse('Invalid Contractor ID', { status: 400 });
  }

  try {
    const existingContractor = await db.select().from(contractors).where(eq(contractors.id, contractorId));

    if (existingContractor.length === 0) {
      return new NextResponse('Contractor not found', { status: 404 });
    }

    const ownedBusinessIds = await getOwnedBusinessIds(user.id);

    if (!ownedBusinessIds.includes(existingContractor[0].businessId)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await db.delete(contractors).where(eq(contractors.id, contractorId));

    return new NextResponse('Contractor deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting contractor:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
