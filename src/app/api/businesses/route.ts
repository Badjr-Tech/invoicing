import { NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const userBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.userId, user.id));
    return NextResponse.json(userBusinesses, { status: 200 });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
