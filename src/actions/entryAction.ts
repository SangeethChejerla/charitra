'use server';

import { db } from '@/db/db';
import { posts, postTags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Input validation schema for creating a blog
const CreateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.number()).min(1, 'At least one tag is required'),
  date: z.string().min(1, 'Date is required'),
});

// Input validation schema for updating a blog
const UpdateBlogSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.number()).min(1, 'At least one tag is required'),
});

export async function createBlogAction(data: {
  title: string;
  slug: string;
  content: string;
  tags: number[];
  date: string;
}) {
  // Validate input data
  const validatedData = CreateBlogSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: validatedData.error.errors[0].message };
  }

  try {
    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // Create the blog post
      const [post] = await tx
        .insert(posts)
        .values({
          title: validatedData.data.title,
          slug: validatedData.data.slug,
          content: validatedData.data.content,
          createdAt: validatedData.data.date,
        })
        .returning();

      if (!post) {
        throw new Error('Failed to create the blog post');
      }

      // Create the tag associations
      const tagAssociations = validatedData.data.tags.map((tagId) => ({
        postId: post.id,
        tagId: tagId,
      }));

      await tx.insert(postTags).values(tagAssociations);

      return post;
    });

    revalidatePath('/');
    return {
      message: 'Blog created successfully',
      slug: result.slug,
    };
  } catch (error: any) {
    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed')
    ) {
      return { error: 'That slug already exists.' };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while creating the blog.',
    };
  }
}

export async function updateBlogAction(data: {
  slug: string;
  title: string;
  content: string;
  tags: number[];
}) {
  // Validate input data
  const validatedData = UpdateBlogSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: validatedData.error.errors[0].message };
  }

  try {
    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // Update the blog post
      const [updatedPost] = await tx
        .update(posts)
        .set({
          title: validatedData.data.title,
          content: validatedData.data.content,
          updateAt: new Date(),
        })
        .where(eq(posts.slug, validatedData.data.slug))
        .returning();

      if (!updatedPost) {
        throw new Error('Failed to update the blog entry');
      }

      // Delete existing tag associations
      await tx.delete(postTags).where(eq(postTags.postId, updatedPost.id));

      // Create new tag associations
      const tagAssociations = validatedData.data.tags.map((tagId) => ({
        postId: updatedPost.id,
        tagId: tagId,
      }));

      await tx.insert(postTags).values(tagAssociations);

      return updatedPost;
    });

    revalidatePath(`/entry/${validatedData.data.slug}`);
    revalidatePath('/');
    return { message: 'Blog updated successfully' };
  } catch (error: any) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while updating the blog.',
    };
  }
}

export async function deleteBlogAction(slug: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // First get the post to delete
      const [post] = await tx.select().from(posts).where(eq(posts.slug, slug));

      if (!post) {
        throw new Error('Blog entry not found.');
      }

      // Delete associated tags
      await tx.delete(postTags).where(eq(postTags.postId, post.id));

      // Delete the post
      await tx.delete(posts).where(eq(posts.slug, slug));

      return post;
    });

    revalidatePath('/');
    return { message: 'Blog deleted successfully' };
  } catch (error: any) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while deleting the blog.',
    };
  }
}
