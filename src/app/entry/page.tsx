// app/blog/page.tsx
import CollapsibleBlogList from '@/components/collapseCard';
import SearchInput from '@/components/SearchInput';
import { db } from '@/db/db';
import { posts, postTags, tags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

interface Tag {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  content: string | null;
}

interface PostWithTags extends Post {
  tags: Tag[];
}

interface BlogPageProps {
  searchParams:
    | {
        q?: string;
      }
    | Promise<{
        q?: string;
      }>;
}

const getBlogData = cache(async () => {
  const allTags = await db.select().from(tags);
  const postsWithTagsResult = await db
    .select({
      post: posts,
      tag: tags,
    })
    .from(posts)
    .leftJoin(postTags, eq(posts.id, postTags.postId))
    .leftJoin(tags, eq(postTags.tagId, tags.id))
    .orderBy(posts.createdAt);

  const transformedPosts: PostWithTags[] = postsWithTagsResult
    .reduce((acc: PostWithTags[], row) => {
      let post = acc.find((p) => p.id === row.post.id);

      if (!post) {
        post = {
          ...row.post,
          createdAt: new Date(row.post.createdAt), // Corrected line: Ensure createdAt is a Date object
          tags: [],
        } as unknown as PostWithTags;
        acc.push(post);
      }

      if (row.tag) {
        post.tags.push(row.tag as unknown as Tag);
      }

      return acc;
    }, [])
    // Sort in descending order (latest first)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return { allTags, transformedPosts };
});

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { allTags, transformedPosts } = await getBlogData();

  const postsByTag: Record<number, PostWithTags[]> = {};
  transformedPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!postsByTag[tag.id]) postsByTag[tag.id] = [];
      postsByTag[tag.id].push(post);
    });
  });

  const query = (await searchParams).q || '';
  const lowerCaseQuery = query.toLowerCase();

  const filteredPosts = query
    ? transformedPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(lowerCaseQuery);
        const contentMatch = post.content
          ? (post.content as string).toLowerCase().includes(lowerCaseQuery)
          : false;
        const headingMatch = post.content
          ? (post.content as string)
              .split('\n')
              .some(
                (line) =>
                  line.startsWith('#') &&
                  line.toLowerCase().includes(lowerCaseQuery)
              )
          : false;

        return titleMatch || contentMatch || headingMatch;
      })
    : transformedPosts;

  const filteredPostsByTag: Record<number, PostWithTags[]> = {};
  filteredPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!filteredPostsByTag[tag.id]) filteredPostsByTag[tag.id] = [];
      filteredPostsByTag[tag.id].push(post);
    });
  });

  const allUntaggedPosts = filteredPosts.filter(
    (post) => post.tags.length === 0
  );

  return (
    <section className="min-h-screen py-16 md:py-24 text-white">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-center mb-8">
          <SearchInput />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-mono mb-12 text-center">
          Entries
        </h1>
        <CollapsibleBlogList
          allTags={allTags}
          filteredPosts={filteredPosts}
          filteredPostsByTag={filteredPostsByTag}
          postsByTag={postsByTag}
          allUntaggedPosts={allUntaggedPosts}
        />
      </div>
    </section>
  );
}
