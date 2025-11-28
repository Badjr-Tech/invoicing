import { NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  // TODO: Implement proper authentication and get the actual userId
  const userId = 1; // Placeholder userId for now

  // if (!userId) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    const userBusinesses = await db.select().from(businesses).where(eq(businesses.userId, userId));
    return NextResponse.json(userBusinesses, { status: 200 });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
