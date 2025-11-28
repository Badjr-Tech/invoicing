import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { contractors, businesses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {

  // TODO: Implement proper authentication and get the actual userId

  const userId = 1; // Placeholder userId for now

  const contractorId = parseInt(params.id);



  // if (!userId) {

  //   return new NextResponse('Unauthorized', { status: 401 });

  // }



  if (isNaN(contractorId)) {

    return new NextResponse('Invalid Contractor ID', { status: 400 });

  }



  try {

    const body = await request.json();

    const { name, role, monthlyPayment, businessId, taxId, address, city, state, zipCode } = body;



    // Fetch the contractor to ensure ownership

    const existingContractor = await db.select().from(contractors).where(eq(contractors.id, contractorId));



    if (existingContractor.length === 0) {

      return new NextResponse('Contractor not found', { status: 404 });

    }



    // Verify that the contractor belongs to one of the user's businesses

    const userBusinesses = await db.select({ id: businesses.id }).from(businesses).where(eq(businesses.userId, userId));

    const businessIds = userBusinesses.map(b => b.id);



    if (!businessIds.includes(existingContractor[0].businessId)) {

      return new NextResponse('Unauthorized to update this contractor', { status: 403 });

    }



    const updatedContractor = await db.update(contractors).set({

      name: name,

      role: role,

      monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment) : undefined,

      businessId: businessId,

      taxId: taxId,

      address: address,

      city: city,

      state: state,

      zipCode: zipCode,

      updatedAt: new Date(),

    }).where(eq(contractors.id, contractorId)).returning();



    return NextResponse.json(updatedContractor[0], { status: 200 });

  } catch (error) {

    console.error('Error updating contractor:', error);

    return new NextResponse('Internal Server Error', { status: 500 });

  }

}



export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

  // TODO: Implement proper authentication and get the actual userId

  const userId = 1; // Placeholder userId for now

  const contractorId = parseInt(params.id);



  // if (!userId) {

  //   return new NextResponse('Unauthorized', { status: 401 });

  // }



  if (isNaN(contractorId)) {

    return new NextResponse('Invalid Contractor ID', { status: 400 });

  }



  try {

    // Fetch the contractor to ensure ownership

    const existingContractor = await db.select().from(contractors).where(eq(contractors.id, contractorId));



    if (existingContractor.length === 0) {

      return new NextResponse('Contractor not found', { status: 404 });

    }



    // Verify that the contractor belongs to one of the user's businesses

    const userBusinesses = await db.select({ id: businesses.id }).from(businesses).where(eq(businesses.userId, userId));

    const businessIds = userBusinesses.map(b => b.id);



    if (!businessIds.includes(existingContractor[0].businessId)) {

      return new NextResponse('Unauthorized to delete this contractor', { status: 403 });

    }



    await db.delete(contractors).where(eq(contractors.id, contractorId));



    return new NextResponse('Contractor deleted successfully', { status: 200 });

  } catch (error) {

    console.error('Error deleting contractor:', error);

    return new NextResponse('Internal Server Error', { status: 500 });

  }

}






