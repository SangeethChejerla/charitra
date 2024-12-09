import { sql } from 'drizzle-orm';
import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

export const posts = table('posts', {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text(),
  title: text(),
  content: text(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export const views = table('views', {
  slug: text('slug').primaryKey(),
  count: integer('count').notNull(),
});
