import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { contractors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getSessionUser } from '@/lib/session';
import { getOwnedBusinessIds } from '@/lib/tenancy';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
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

    const invitationToken = uuidv4();
    const invitationSentAt = new Date();

    const updatedContractor = await db.update(contractors).set({
      invitationToken: invitationToken,
      invitationSentAt: invitationSentAt,
      updatedAt: new Date(),
    }).where(eq(contractors.id, contractorId)).returning();

    if (updatedContractor.length === 0) {
      return new NextResponse('Failed to generate invitation', { status: 500 });
    }

    // NOTE: /onboard-contractor/[token] does not exist yet, so this link 404s.
    const invitationLink = `${request.nextUrl.origin}/onboard-contractor/${invitationToken}`;

    return NextResponse.json({ invitationLink: invitationLink }, { status: 200 });
  } catch (error) {
    console.error('Error generating invitation:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
