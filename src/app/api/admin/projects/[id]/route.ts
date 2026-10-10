import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        content: body.content,
        htmlUrl: body.htmlUrl,
        homepage: body.homepage,
        language: body.language,
        topics: body.topics,
        imageUrl: body.imageUrl,
        isFeatured: body.isFeatured,
        isVisible: body.isVisible,
      }
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

