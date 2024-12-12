import BlogCard from '@/components/BlogCard';
import SearchInput from '@/components/SearchInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/db/db';
import { posts, postTags, tags } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

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
export default async function BlogPage({ searchParams }: BlogPageProps) {
  // 1. Fetch Data
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

  // 2. Transform Data
  const transformedPosts: PostWithTags[] = postsWithTagsResult
    .reduce((acc: PostWithTags[], row) => {
      let post = acc.find((p) => p.id === row.post.id);

      if (!post) {
        post = {
          ...row.post,
          createdAt: new Date(row.post.createdAt),
          tags: [],
        } as unknown as PostWithTags;
        acc.push(post);
      }

      if (row.tag) {
        post.tags.push(row.tag as unknown as Tag);
      }

      return acc;
    }, [])
    .reverse();

  // 3. Organize Posts by Tag
  const postsByTag: Record<number, PostWithTags[]> = {};
  transformedPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!postsByTag[tag.id]) postsByTag[tag.id] = [];
      postsByTag[tag.id].push(post);
    });
  });

  // 4. Filter Posts
  const query = (await searchParams).q || '';

  // Filtering logic
  const filteredPosts = query
    ? transformedPosts.filter((post) => {
        const titleMatch = post.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const contentMatch = post.content
          ? (post.content as string).toLowerCase().includes(query.toLowerCase())
          : false;
        const headingMatch = post.content
          ? (post.content as string)
              .split('\n')
              .some(
                (line) =>
                  line.startsWith('#') &&
                  line.toLowerCase().includes(query.toLowerCase())
              )
          : false;

        return titleMatch || contentMatch || headingMatch;
      })
    : transformedPosts;

  const filteredPostsByTag: Record<number, PostWithTags[]> = {};
  if (query) {
    filteredPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!filteredPostsByTag[tag.id]) filteredPostsByTag[tag.id] = [];
        filteredPostsByTag[tag.id].push(post);
      });
    });
  }

  return (
    <section className="min-h-screen py-16 md:py-24 text-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-center mb-8">
          <SearchInput />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-mono mb-12 text-center">
          Entries
        </h1>
        <Tabs defaultValue="all" className="flex flex-col items-center">
          <TabsList className="mb-12 flex flex-wrap justify-center gap-2 TabsList">
            <TabsTrigger value="all" className="TabsTrigger">
              All
            </TabsTrigger>
            {allTags.map((tag) => (
              <TabsTrigger
                key={tag.id}
                value={tag.id.toString()}
                className="TabsTrigger"
              >
                {tag.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full max-w-4xl mx-auto">
            <TabsContent value="all">
              <div className="flex flex-col gap-8">
                {filteredPosts.map((post) => (
                  //@ts-ignore
                  <BlogCard key={post.id} post={post} className="BlogCard" />
                ))}
              </div>
            </TabsContent>

            {allTags.map((tag) => (
              <TabsContent key={tag.id} value={tag.id.toString()}>
                <div className="flex flex-col gap-8">
                  {(filteredPostsByTag[tag.id] || postsByTag[tag.id])?.map(
                    (post) => (
                      <BlogCard
                        key={post.id}
                        //@ts-ignore
                        post={post}
                        className="BlogCard"
                      />
                    )
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
