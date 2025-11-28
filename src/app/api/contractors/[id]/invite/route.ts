import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { contractors, businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // For generating unique tokens

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // TODO: Implement proper authentication and get the actual userId
  const userId = 1; // Placeholder userId for now
  const contractorId = parseInt(params.id);

  if (isNaN(contractorId)) {
    return new NextResponse('Invalid Contractor ID', { status: 400 });
  }

  try {
    // Verify that the contractor belongs to one of the user's businesses
    const existingContractor = await db.select().from(contractors).where(eq(contractors.id, contractorId));

    if (existingContractor.length === 0) {
      return new NextResponse('Contractor not found', { status: 404 });
    }

    const userBusinesses = await db.select({ id: businesses.id }).from(businesses).where(eq(businesses.userId, userId));
    const businessIds = userBusinesses.map(b => b.id);

    if (!businessIds.includes(existingContractor[0].businessId)) {
      return new NextResponse('Unauthorized to invite this contractor', { status: 403 });
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

    // Construct the invitation link (replace with your actual domain)
    const invitationLink = `${request.nextUrl.origin}/onboard-contractor/${invitationToken}`;

    return NextResponse.json({ invitationLink: invitationLink }, { status: 200 });
  } catch (error) {
    console.error('Error generating invitation:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
