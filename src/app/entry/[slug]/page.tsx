// entry/[slug]/page.tsx
import { ViewCounter } from '@/components/ViewCounter';
import { db } from '@/db/db';
import { views } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';

interface Params {
  slug: string;
}

interface PageProps {
  params: Promise<Params>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.slug, slug),
  });

  if (!post || !post.slug) {
    notFound();
  }

  const initialViewsData = await db
    .select()
    .from(views)
    .where(sql`${views.slug} = ${slug}`);
  const initialCount = initialViewsData[0]?.count || 0;
  const val = initialViewsData[0]?.count || 0;

  return (
    <article className="container py-12 md:py-20 max-w-3xl mx-auto bg-black text-white">
      <header className="mb-12 flex flex-col gap-y-4 justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
            {post.title}
          </h1>
        </div>
        {/* Pass initialCount to ViewCounter */}
        <ViewCounter slug={slug} initialCount={initialCount} />
      </header>

      <div
        className="prose prose-invert max-w-none text-lg text-white leading-relaxed
                   prose-img:rounded-xl prose-img:mx-auto prose-img:my-6 prose-img:block
                   prose-headings:font-bold prose-headings:font-mono prose-headings:text-white prose-headings:mt-8 prose-headings:mb-4
                   prose-p:my-4 prose-p:text-white prose-p:font-mono
                   prose-blockquote:border-l-4 prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic
                   prose-ul:list-disc prose-ul:ml-6 prose-ul:my-4 prose-ul:font-mono
                   prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-4 prose-ol:font-mono
                   prose-a:text-blue-400 prose-a:hover:underline
                   prose-code:bg-gray-800 prose-code:text-gray-300 prose-code:p-1 prose-code:rounded prose-code:font-mono
                   prose-pre:bg-gray-800 prose-pre:text-gray-300 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:font-mono"
      >
        <div
          className="text-white"
          dangerouslySetInnerHTML={{ __html: post.content as string }}
        />
      </div>
    </article>
  );
}
