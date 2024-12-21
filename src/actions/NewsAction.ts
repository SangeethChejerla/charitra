'use server';

import { db } from '@/db/db';
import { InsertNewPaper, newspapers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getNewsPaperByDate(date: string) {
  try {
    return await db.query.newspapers.findFirst({
      where: (newspapers, { eq }) => eq(newspapers.date, date),
    });
  } catch (error) {
    console.error('Failed to fetch news by date:', error);
    return null;
  }
}

export async function createOrUpdateNewsPaper(
  data: Omit<InsertNewPaper, 'createdAt' | 'updateAt'>
) {
  try {
    const existingPaper = await getNewsPaperByDate(data.date);

    if (existingPaper) {
      await db
        .update(newspapers)
        .set({ ...data })
        .where(eq(newspapers.date, data.date));
    } else {
      await db
        .insert(newspapers)
        .values({ ...data })
        .returning();
    }
    revalidatePath('/');
    return { message: 'Success' };
  } catch (error) {
    console.error('Failed to create or update news:', error);
    return { message: 'Error' };
  }
}
