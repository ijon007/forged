import { pgTable, text, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const course = pgTable("course", {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  originalContent: text('original_content').notNull(),
  tags: json('tags').$type<string[]>().notNull().default([]),
  keyPoints: json('key_points').$type<string[]>().notNull().default([]),
  estimatedReadTime: integer('estimated_read_time').notNull(),
  price: integer('price').notNull(), // Store price in cents to avoid floating point issues
  published: boolean('published').notNull().default(false),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});

export type Course = typeof course.$inferSelect;
export type NewCourse = typeof course.$inferInsert; 