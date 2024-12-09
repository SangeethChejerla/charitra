// components/BlogList.tsx (Server Component)
import BlogCard from '@/components/BlogCard';
import { db } from '@/db/db';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await db.query.posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  return (
    <section className="py-24 text-white">
      <div className="flex  flex-col max-w-3xl mx-auto gap-3 ">
        <h1 className="text-3xl font-bold font-mono mb-12 text-center">
          Entries
        </h1>

        {posts.map((post) => (
          // @ts-ignore
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
