import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // We only have one landing page setting row (id = 1)
    const settings = await prisma.landingPage.upsert({
      where: { id: 1 },
      update: {
        heroName: data.heroName,
        heroRole: data.heroRole,
        heroDescription: data.heroDescription,
        cvLink: data.cvLink,
        location: data.location,
        availability: data.availability,
        spinningText: data.spinningText,
      },
      create: {
        id: 1,
        heroName: data.heroName,
        heroRole: data.heroRole,
        heroDescription: data.heroDescription,
        cvLink: data.cvLink,
        location: data.location,
        availability: data.availability,
        spinningText: data.spinningText,
      }
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
