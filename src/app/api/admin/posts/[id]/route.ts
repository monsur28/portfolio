import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';
import { isUniqueViolation, revalidateBlog, toPostData } from '@/lib/post-input';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const parsed = toPostData(await request.json(), existing);
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const post = await prisma.post.update({ where: { id }, data: parsed.data });
    revalidateBlog(existing.slug, post.slug);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: 'Another post already uses that slug.' }, { status: 409 });
    }
    console.error('Post update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const post = await prisma.post.delete({ where: { id } });
    revalidateBlog(post.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Post delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
