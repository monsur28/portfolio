import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';
import { isUniqueViolation, revalidateBlog, toPostData } from '@/lib/post-input';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const parsed = toPostData(await request.json());
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const post = await prisma.post.create({ data: parsed.data });
    revalidateBlog(post.slug);

    return NextResponse.json(post);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: 'Another post already uses that slug.' }, { status: 409 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
