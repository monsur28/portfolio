import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { getAdminSession } from '@/lib/admin-auth';

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch from Github
    const res = await fetch('https://api.github.com/users/monsur28/repos?sort=updated&per_page=100');
    if (!res.ok) {
      throw new Error('Failed to fetch from GitHub');
    }

    const repos = await res.json();
    let added = 0;
    let updated = 0;

    for (const repo of repos) {
      // Don't import forks unless you want to
      if (repo.fork) continue;

      const slug = slugify(repo.name, { lower: true, strict: true });
      
      const existing = await prisma.project.findUnique({
        where: { githubId: repo.id }
      });

      if (existing) {
        // Update existing (only overwrite things that might change on Github, 
        // but preserve manual edits like 'content' or 'image')
        await prisma.project.update({
          where: { id: existing.id },
          data: {
            name: repo.name,
            // Only update description if it wasn't manually overridden (for simplicity, we just won't override it here to be safe)
            htmlUrl: repo.html_url,
            homepage: repo.homepage || existing.homepage,
            language: repo.language || existing.language,
          }
        });
        updated++;
      } else {
        // Create new
        await prisma.project.create({
          data: {
            githubId: repo.id,
            name: repo.name,
            slug,
            description: repo.description,
            htmlUrl: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            topics: JSON.stringify(repo.topics || []),
            isVisible: true,
            isFeatured: false,
          }
        });
        added++;
      }
    }

    return NextResponse.json({ success: true, added, updated });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
