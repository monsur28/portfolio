import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { getAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Automatically generate slug if it's empty
    const slug = data.slug || slugify(data.name, { lower: true, strict: true });
    
    const project = await prisma.project.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        content: data.content,
        htmlUrl: data.htmlUrl,
        homepage: data.homepage,
        language: data.language,
        topics: data.topics,
        imageUrl: data.imageUrl,
        isFeatured: data.isFeatured,
        isVisible: data.isVisible,
      }
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
