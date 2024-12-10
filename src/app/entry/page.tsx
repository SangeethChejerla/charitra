import BlogCard from '@/components/BlogCard';
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
}

interface PostWithTags extends Post {
  tags: Tag[];
}

export default async function BlogPage() {
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

  // Transform the data to group tags with their respective posts
  const transformedPosts: PostWithTags[] = postsWithTagsResult.reduce(
    (acc: PostWithTags[], row) => {
      let post = acc.find((p) => p.id === row.post.id);

      if (!post) {
        //@ts-ignore
        post = {
          ...row.post,
          createdAt: new Date(row.post.createdAt), // Convert to Date object
          tags: [],
        };
        //@ts-ignore
        acc.push(post);
      }

      // Only add the tag if it exists (due to leftJoin, it might be null)
      if (row.tag) {
        //@ts-ignore
        post.tags.push(row.tag);
      }

      return acc;
    },
    []
  );

  // Organize posts by tag (only tagged posts)
  const postsByTag: Record<number, PostWithTags[]> = {};
  transformedPosts.forEach((post) => {
    if (post.tags.length > 0) {
      post.tags.forEach((tag) => {
        if (!postsByTag[tag.id]) postsByTag[tag.id] = [];
        postsByTag[tag.id].push(post);
      });
    }
  });

  return (
    <section className="min-h-screen py-16 md:py-24 text-white">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-mono mb-12 text-center ">
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
                {transformedPosts.map((post) => (
                  //@ts-ignore
                  <BlogCard key={post.id} post={post} className="BlogCard" />
                ))}
              </div>
            </TabsContent>

            {allTags.map((tag) => (
              <TabsContent key={tag.id} value={tag.id.toString()}>
                <div className="flex flex-col gap-8">
                  {postsByTag[tag.id]?.map((post) => (
                    //@ts-ignore
                    <BlogCard key={post.id} post={post} className="BlogCard" />
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
